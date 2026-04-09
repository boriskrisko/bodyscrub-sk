import { createClient } from '@/lib/supabase/server';
import { BlogPost } from '@/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Článok nenájdený' };

  return {
    title: post.title,
    description: post.excerpt || post.content?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.published_at || undefined,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // Article structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image,
    author: post.author ? { '@type': 'Person', name: post.author } : undefined,
    datePublished: post.published_at,
    url: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="pt-24 pb-20 px-6 md:px-10 max-w-[700px] mx-auto min-h-screen">
        <nav className="text-sm text-sand-600 mb-8">
          <Link href="/" className="hover:text-moss-600 transition-colors">Domov</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-moss-600 transition-colors">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{post.title}</span>
        </nav>

        {post.cover_image && (
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="text-xs text-sand-400 mb-4">
          {post.author && <span>{post.author} · </span>}
          {post.published_at && formatDate(post.published_at)}
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-medium mb-8">{post.title}</h1>

        <div className="prose prose-sand max-w-none text-sand-800 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>
    </>
  );
}
