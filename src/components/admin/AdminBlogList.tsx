'use client';

import { useState } from 'react';
import { BlogPost } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminBlogList({ posts }: { posts: BlogPost[] }) {
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    author: '',
    is_published: false,
  });

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content || '',
      excerpt: post.excerpt || '',
      cover_image: post.cover_image || '',
      author: post.author || '',
      is_published: post.is_published,
    });
  };

  const startCreate = () => {
    setCreating(true);
    setForm({ title: '', slug: '', content: '', excerpt: '', cover_image: '', author: '', is_published: false });
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      cover_image: form.cover_image || null,
      excerpt: form.excerpt || null,
      author: form.author || null,
      published_at: form.is_published ? new Date().toISOString() : null,
    };

    if (editing) {
      await supabase.from('blog_posts').update(data).eq('id', editing.id);
    } else {
      await supabase.from('blog_posts').insert(data);
    }
    setEditing(null);
    setCreating(false);
    router.refresh();
  };

  const deletePost = async (id: string) => {
    if (!confirm('Zmazať článok?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    router.refresh();
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors';

  if (creating || editing) {
    return (
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-medium">
            {editing ? 'Upraviť článok' : 'Nový článok'}
          </h2>
          <button type="button" onClick={() => { setEditing(null); setCreating(false); }} className="btn-outline !py-1.5 !px-3 !text-xs">Zrušiť</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-sand-600 mb-1">Titulok</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} onBlur={() => !form.slug && generateSlug()} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-sand-600 mb-1">Slug</label>
              <div className="flex gap-2">
                <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
                <button type="button" onClick={generateSlug} className="btn-outline !py-1.5 !px-3 !text-xs shrink-0">Auto</button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-sand-600 mb-1">Excerpt</label>
            <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-sand-600 mb-1">Obsah (Markdown)</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={15} className={`${inputClass} font-mono text-xs`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-sand-600 mb-1">Cover Image URL</label>
              <input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-sand-600 mb-1">Autor</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Publikovať
          </label>
          <button type="submit" className="btn-primary">
            {editing ? 'Uložiť' : 'Vytvoriť'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <button onClick={startCreate} className="btn-primary mb-6">+ Nový článok</button>
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg border border-sand-200 p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{post.title}</div>
              <div className="text-sm text-sand-600">
                {post.author || 'Bez autora'}
                {post.is_published
                  ? <span className="text-moss-600 ml-2">Publikovaný</span>
                  : <span className="text-sand-400 ml-2">Draft</span>
                }
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(post)} className="btn-outline !py-1.5 !px-3 !text-xs">Upraviť</button>
              <button onClick={() => deletePost(post.id)} className="btn-outline !py-1.5 !px-3 !text-xs !border-red-200 !text-red-500">Zmazať</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sand-600 text-center py-8">Žiadne články</p>}
      </div>
    </>
  );
}
