import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, PackagePlus, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category, Product, ProductWithCategory } from '@/lib/types';
import { uploadImage } from '@/lib/storage';

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const [p, c] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProducts(p.data ?? []);
    setCategories(c.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  }

  async function restock(product: Product) {
    const value = window.prompt(`Unidades a agregar para ${product.name}:`, '1');
    if (value === null) return;
    const amount = Number(value);
    if (!Number.isInteger(amount) || amount <= 0) {
      window.alert('Ingresa un número entero mayor que cero.');
      return;
    }
    const { error } = await supabase.from('products').update({ stock: product.stock + amount }).eq('id', product.id);
    if (error) window.alert(error.message);
    else load();
  }

  const withCat: ProductWithCategory[] = products.map((p) => ({
    ...p,
    category: categories.find((c) => c.id === p.category_id) ?? null,
  }));

  const filtered = withCat.filter((p) => {
    const q = query.trim().toLowerCase();
    return q ? p.name.toLowerCase().includes(q) : true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Productos</h1>
          <p className="mt-1 text-sm text-slate-500">{products.length} productos en el catálogo</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-ink">
          <Plus className="h-4 w-4" /> Nuevo producto
        </button>
      </div>

      <div className="relative mt-5 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar producto..." className="input pl-10" />
      </div>

      {loading ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="card flex gap-3 p-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">{p.category?.name ?? 'Sin categoría'}</p>
                <p className="mt-1 text-xs font-medium text-emerald-700">Stock: {p.stock}</p>
                {p.price != null && <p className="mt-1 text-sm font-bold text-ink">S/ {p.price.toFixed(2)}</p>}
                <div className="mt-2 flex gap-1">
                  <button title="Reponer stock" onClick={() => restock(p)} className="grid h-7 w-7 place-items-center rounded-lg text-emerald-600 hover:bg-emerald-50"><PackagePlus className="h-3.5 w-3.5" /></button>
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-ink"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(p.id)} className="grid h-7 w-7 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-slate-500">Sin resultados.</p>}
        </div>
      )}

      {showForm && (
        <ProductForm
          initial={editing}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}

function ProductForm({ initial, categories, onClose, onSaved }: { initial: Product | null; categories: Category[]; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? '');
  const [imageUrl] = useState(initial?.image_url ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState(initial?.video_url ?? '');
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '));
  const [price, setPrice] = useState(initial?.price?.toString() ?? '');
  const [stock, setStock] = useState((initial?.stock ?? 0).toString());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const uploadedImageUrl = imageFile ? await uploadImage(imageFile, 'products') : imageUrl;
      const payload = {
      name,
      description: description || null,
      category_id: categoryId || null,
      image_url: uploadedImageUrl || null,
      video_url: videoUrl || null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      price: price ? Number(price) : null,
      stock: stock ? Number(stock) : 0,
    };
      let res;
      if (initial) {
        res = await supabase.from('products').update(payload).eq('id', initial.id);
      } else {
        res = await supabase.from('products').insert(payload);
      }
      if (res.error) { setError(res.error.message); return; }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{initial ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Nombre comercial / real</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" required placeholder="Martillo de uña" />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input resize-none" placeholder="Mango ergonómico..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Categoría</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
                <option value="">Sin categoría</option>
                {categories.map((c) => {
                  return <option key={c.id} value={c.id}>{c.name}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="label">Precio (opcional)</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="input" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="label">Stock (unidades disponibles)</label>
            <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="input" placeholder="0" />
          </div>
          <div>
            <label className="label">Imagen del producto</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-slate-600 hover:border-ink hover:text-ink">
              <Upload className="h-4 w-4" /> {imageFile ? imageFile.name : 'Subir imagen'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            </label>
            {imageUrl && <img src={imageUrl} alt="preview" className="mt-2 h-24 w-24 rounded-xl object-cover" />}
          </div>
          <div>
            <label className="label">URL del video (opcional)</label>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input" placeholder="https://...mp4" />
          </div>
          <div>
            <label className="label">Etiquetas (separadas por comas)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="input" placeholder="Envío a domicilio, En stock" />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-ink disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
