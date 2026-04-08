-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  category text not null,
  tags text[] default '{}',
  weight_grams int,
  ingredients text,
  images jsonb default '[]',
  stock int default 0,
  is_active boolean default true,
  is_featured boolean default false,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users(id),
  email text not null,
  status text not null default 'pending',
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null default 0,
  shipping_cost numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  shipping_address jsonb,
  billing_address jsonb,
  stripe_session_id text,
  stripe_payment_intent text,
  coupon_code text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Coupons
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null,
  value numeric(10,2) not null,
  min_order numeric(10,2),
  max_uses int,
  used_count int default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean default true
);

-- Blog posts
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  cover_image text,
  author text,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Newsletter subscribers
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  is_active boolean default true,
  subscribed_at timestamptz default now()
);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references auth.users(id),
  name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  text text,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- Indexes
create index idx_products_slug on products(slug);
create index idx_products_category on products(category);
create index idx_products_is_active on products(is_active);
create index idx_orders_user_id on orders(user_id);
create index idx_orders_order_number on orders(order_number);
create index idx_reviews_product_id on reviews(product_id);
create index idx_blog_posts_slug on blog_posts(slug);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();
create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

-- RLS
alter table products enable row level security;
alter table orders enable row level security;
alter table coupons enable row level security;
alter table blog_posts enable row level security;
alter table newsletter_subscribers enable row level security;
alter table reviews enable row level security;

-- Helper: check admin role
create or replace function is_admin()
returns boolean as $$
begin
  return coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
end;
$$ language plpgsql security definer;

-- Products policies
create policy "Products are viewable by everyone"
  on products for select using (is_active = true);
create policy "Products viewable by admin"
  on products for select using (is_admin());
create policy "Admin can insert products"
  on products for insert with check (is_admin());
create policy "Admin can update products"
  on products for update using (is_admin());
create policy "Admin can delete products"
  on products for delete using (is_admin());

-- Orders policies
create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id or is_admin());
create policy "Anyone can create orders"
  on orders for insert with check (true);
create policy "Admin can update orders"
  on orders for update using (is_admin());

-- Reviews policies
create policy "Approved reviews are viewable"
  on reviews for select using (is_approved = true or is_admin());
create policy "Authenticated users can create reviews"
  on reviews for insert with check (auth.uid() is not null);
create policy "Admin can update reviews"
  on reviews for update using (is_admin());
create policy "Admin can delete reviews"
  on reviews for delete using (is_admin());

-- Coupons policies
create policy "Active coupons are viewable"
  on coupons for select using (is_active = true or is_admin());
create policy "Admin can insert coupons"
  on coupons for insert with check (is_admin());
create policy "Admin can update coupons"
  on coupons for update using (is_admin());
create policy "Admin can delete coupons"
  on coupons for delete using (is_admin());

-- Blog posts policies
create policy "Published posts are viewable"
  on blog_posts for select using (is_published = true or is_admin());
create policy "Admin can insert posts"
  on blog_posts for insert with check (is_admin());
create policy "Admin can update posts"
  on blog_posts for update using (is_admin());
create policy "Admin can delete posts"
  on blog_posts for delete using (is_admin());

-- Newsletter policies
create policy "Admin can view subscribers"
  on newsletter_subscribers for select using (is_admin());
create policy "Anyone can subscribe"
  on newsletter_subscribers for insert with check (true);
create policy "Admin can update subscribers"
  on newsletter_subscribers for update using (is_admin());

-- Storage bucket for product images
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict do nothing;

create policy "Public read access on product images"
  on storage.objects for select using (bucket_id = 'products');
create policy "Admin can upload product images"
  on storage.objects for insert with check (bucket_id = 'products' and is_admin());
create policy "Admin can update product images"
  on storage.objects for update using (bucket_id = 'products' and is_admin());
create policy "Admin can delete product images"
  on storage.objects for delete using (bucket_id = 'products' and is_admin());
