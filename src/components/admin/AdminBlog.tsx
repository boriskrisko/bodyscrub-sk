'use client';

import { useState } from 'react';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ConfirmDialog, EmptyState, useToast } from './AdminUI';

export default function AdminBlog({ posts }: { posts: BlogPost[] }) {
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', content: '', excerpt: '', cover_image: '', author: '', is_published: false,
  });
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title, slug: post.slug, content: post.content || '',
      excerpt: post.excerpt || '', cover_image: post.cover_image || '',
      author: post.author || '', is_published: post.is_published,
    });
  };

  const startCreate = () => {
    setCreating(true);
    setForm({ title: '', slug: '', content: '', excerpt: '', cover_image: '', author: '', is_published: false });
  };

  const generateSlug = () => {
    const slug = form.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      cover_image: form.cover_image || null, excerpt: form.excerpt || null, author: form.author || null,
      published_at: form.is_published ? new Date().toISOString() : null,
    };
    if (editing) {
      await supabase.from('blog_posts').update(data).eq('id', editing.id);
      toast('Článok uložený');
    } else {
      await supabase.from('blog_posts').insert(data);
      toast('Článok vytvorený');
    }
    setEditing(null); setCreating(false);
    router.refresh();
  };

  const deletePost = async () => {
    if (!deleteId) return;
    await supabase.from('blog_posts').delete().eq('id', deleteId);
    toast('Článok vymazaný');
    setDeleteId(null);
    router.refresh();
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors';

  // Editor view
  if (creating || editing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl font-semibold">{editing ? 'Upraviť článok' : 'Nový článok'}</h1>
          <div className="flex gap-2">
            <button onClick={() => setPreview(!preview)} className="btn-outline !text-xs">
              {preview ? 'Editor' : 'Náhľad'}
            </button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="btn-outline !text-xs">Zrušiť</button>
          </div>
        </div>

        {preview ? (
          <div className="bg-white rounded-xl border border-sand-200 p-8 max-w-2xl">
            <h1 className="font-display text-3xl font-medium mb-2">{form.title || 'Bez titulku'}</h1>
            <p className="text-xs text-sand-400 mb-6">{form.author} · Draft</p>
            <div className="text-sand-800 leading-relaxed whitespace-pre-line">{form.content}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
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
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={20} className={`${inputClass} font-mono text-xs`} />
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
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded" />
              Publikovať
            </label>
            <button type="submit" className="btn-primary">{editing ? 'Uložiť' : 'Vytvoriť'}</button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-semibold">Blog</h1>
        <button onClick={startCreate} className="btn-primary !text-xs">+ Nový článok</button>
      </div>

      {posts.length === 0 ? (
        <EmptyState message="Žiadne články" />
      ) : (
        <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200 text-left text-xs text-sand-400 bg-sand-50">
                  <th className="p-3 font-medium">Titulok</th>
                  <th className="p-3 font-medium">Autor</th>
                  <th className="p-3 font-medium text-center">Stav</th>
                  <th className="p-3 font-medium text-right">Dátum</th>
                  <th className="p-3 font-medium text-right">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-3 font-medium">{post.title}</td>
                    <td className="p-3 text-sand-600">{post.author || '—'}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${post.is_published ? 'bg-moss-50 text-moss-600 border-moss-200' : 'bg-sand-50 text-sand-500 border-sand-200'}`}>
                        {post.is_published ? 'Publikovaný' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-right text-sand-400 text-xs">{post.published_at ? formatDate(post.published_at) : '—'}</td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => startEdit(post)} className="px-2 py-1 rounded text-xs text-sand-600 hover:bg-sand-100 transition-colors">Upraviť</button>
                        <button onClick={() => setDeleteId(post.id)} className="px-2 py-1 rounded text-xs text-red-500 hover:bg-red-50 transition-colors">Zmazať</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Zmazať článok?" message="Článok bude natrvalo vymazaný." confirmLabel="Zmazať" destructive onConfirm={deletePost} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
