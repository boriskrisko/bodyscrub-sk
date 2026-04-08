-- Decrease stock atomically
create or replace function decrease_stock(p_product_id uuid, p_quantity int)
returns void as $$
begin
  update products
  set stock = greatest(stock - p_quantity, 0)
  where id = p_product_id;
end;
$$ language plpgsql security definer;

-- Increment coupon usage atomically
create or replace function increment_coupon_usage(p_code text)
returns void as $$
begin
  update coupons
  set used_count = used_count + 1
  where code = p_code;
end;
$$ language plpgsql security definer;
