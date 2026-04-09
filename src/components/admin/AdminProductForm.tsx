'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from './AdminUI';

export default function AdminProductForm({
  product,
  onClose,
}: {
  product?: Product;
  onClose: () => void;
}) {
  const isEdit = !!product;
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price?.toString() || '',
    compare_price: product?.compare_price?.toString() || '',
    category: product?.category || 'oil',
    tags: product?.tags?.join(', ') || '',
    weight_grams: product?.weight_grams?.toString() || '',
    ingredients: product?.ingredients || '',
    stock: product?.stock?.toString() || '0',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    seo_title: product?.seo_title || '',
    seo_description: product?.seo_description || '',
  });
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('products').upload(path, file);
    if (error) {
      alert('Chyba pri uploade obrázka');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('products').getPublicUrl(path);
    setImages((prev) => [
      ...prev,
      { url: urlData.publicUrl, alt: form.name, position: prev.length },
    ]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      short_description: form.short_description || null,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      category: form.category,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      weight_grams: form.weight_grams ? parseInt(form.weight_grams) : null,
      ingredients: form.ingredients || null,
      stock: parseInt(form.stock) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      images,
    };

    if (isEdit) {
      await supabase.from('products').update(data).eq('id', product!.id);
    } else {
      await supabase.from('products').insert(data);
    }

    setSaving(false);
    toast(isEdit ? 'Produkt uložený' : 'Produkt vytvorený');
    router.refresh();
    onClose();
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-medium">
          {isEdit ? 'Upraviť produkt' : 'Nový produkt'}
        </h2>
        <button type="button" onClick={onClose} className="btn-outline !py-1.5 !px-3 !text-xs">
          Zrušiť
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sand-600 mb-1">Názov</label>
            <input name="name" required value={form.name} onChange={handleChange} onBlur={() => !form.slug && generateSlug()} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-sand-600 mb-1">Slug</label>
            <div className="flex gap-2">
              <input name="slug" required value={form.slug} onChange={handleChange} className={inputClass} />
              <button type="button" onClick={generateSlug} className="btn-outline !py-1.5 !px-3 !text-xs shrink-0">
                Auto
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-sand-600 mb-1">Krátky popis</label>
          <input name="short_description" value={form.short_description} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm text-sand-600 mb-1">Popis</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-sand-600 mb-1">Cena (€)</label>
            <input name="price" type="number" step="0.01" required value={form.price} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-sand-600 mb-1">Pôvodná cena</label>
            <input name="compare_price" type="number" step="0.01" value={form.compare_price} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-sand-600 mb-1">Sklad</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-sand-600 mb-1">Hmotnosť (g)</label>
            <input name="weight_grams" type="number" value={form.weight_grams} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sand-600 mb-1">Kategória</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              <option value="oil">Olejové</option>
              <option value="coffee">Kávové</option>
              <option value="matcha">Matcha</option>
              <option value="salt">Soľné</option>
              <option value="charcoal">Charcoal</option>
              <option value="lavender">Levanduľové</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-sand-600 mb-1">Tagy (oddelené čiarkou)</label>
            <input name="tags" value={form.tags} onChange={handleChange} className={inputClass} placeholder="vegan, organic, handmade" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-sand-600 mb-1">Zloženie</label>
          <textarea name="ingredients" value={form.ingredients} onChange={handleChange} rows={3} className={inputClass} />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="rounded" />
            Aktívny
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="rounded" />
            Featured
          </label>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm text-sand-600 mb-2">Obrázky</label>
          <div className="flex gap-3 flex-wrap mb-3">
            {images.filter(img => img.url).map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg border border-sand-200 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <p className="text-xs text-sand-400 mt-1">Nahrávam...</p>}
        </div>

        {/* SEO */}
        <div className="border-t border-sand-200 pt-4 mt-4">
          <h3 className="font-medium text-sm mb-3">SEO</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-sand-600 mb-1">SEO Title</label>
              <input name="seo_title" value={form.seo_title} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-sand-600 mb-1">SEO Description</label>
              <textarea name="seo_description" value={form.seo_description} onChange={handleChange} rows={2} className={inputClass} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Ukladám...' : isEdit ? 'Uložiť zmeny' : 'Vytvoriť produkt'}
        </button>
      </div>
    </form>
  );
}
