import { createClient } from '@/lib/supabase/server';
import { BlogPost } from '@/types';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tipy na starostlivosť o pleť, recepty na domáce peelingy a novinky zo sveta prírodnej kozmetiky.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const posts = (data || []) as BlogPost[];

  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[900px] mx-auto min-h-screen">
      <div className="text-center mb-12">
        <span className="tag bg-sand-100 text-sand-600 mb-3 inline-block">BLOG</span>
        <h1 className="font-display text-3xl md:text-4xl font-light mt-2">
          Prírodná <span className="font-semibold text-moss-600">starostlivosť</span>
        </h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-sand-600">Zatiaľ žiadne články.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-xl border border-sand-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {post.cover_image && (
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="text-xs text-sand-400 mb-2">
                  {post.author && <span>{post.author} · </span>}
                  {post.published_at && formatDate(post.published_at)}
                </div>
                <h2 className="font-display text-xl font-medium mb-2 group-hover:text-moss-600 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-sand-600 leading-relaxed">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
