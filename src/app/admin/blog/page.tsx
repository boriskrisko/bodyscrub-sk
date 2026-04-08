import { createClient } from '@/lib/supabase/server';
import { BlogPost } from '@/types';
import AdminBlogList from '@/components/admin/AdminBlogList';

export default async function AdminBlogPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-6">Blog</h1>
      <AdminBlogList posts={(data || []) as BlogPost[]} />
    </div>
  );
}
