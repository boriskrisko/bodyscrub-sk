import { createClient } from '@/lib/supabase/server';
import { BlogPost } from '@/types';
import AdminBlog from '@/components/admin/AdminBlog';

export default async function AdminBlogPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminBlog posts={(data || []) as BlogPost[]} />;
}
