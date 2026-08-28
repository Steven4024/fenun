import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/types';
import { iconFor } from '@/lib/icons';
import { uploadImage } from '@/lib/storage';

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function CategoriesManager() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await supabase.from('categories').select('*').order('sort_order');
      setItems(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('¿Eliminar esta categoría? Los productos quedarán sin categoría.')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Categorías</h1>
          <p className="mt-1 text-sm text-slate-500">Crea y organiza las categorías de la tienda</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-ink">
          <Plus className="h-4 w-4" /> Nueva
        </button>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => {
            const Icon = iconFor(c.icon);
            return (
              <div key={c.id} className="card flex items-center gap-4 p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-100 text-ink">
                  {c.image_url ? <img src={c.image_url} alt={c.name} className="h-full w-full rounded-full object-cover" /> : <Icon className="h-5 w-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{c.name}</p>
                  <p className="truncate text-xs text-slate-400">/{c.slug} · orden {c.sort_order}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(c); setShowForm(true); }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-ink">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(c.id)} className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <p className="text-sm text-slate-500">Aún no hay categorías. Crea la primera.</p>
          )}
        </div>
      )}

      {showForm && (
        <CategoryForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}

function CategoryForm({ initial, onClose, onSaved }: { initial: Category | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [icon] = useState(initial?.icon ?? 'Package');
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { name, slug: initial?.slug ?? slugify(name), icon, image_url: imageUrl || null, sort_order: sortOrder };
    try {
      const res = initial ? await supabase.from('categories').update(payload).eq('id', initial.id) : await supabase.from('categories').insert(payload);
      if (res.error) { setError(res.error.message); return; }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la categoría.');
    } finally {
      setSaving(false);
    }
  }

  async function selectImage(file: File | undefined) {
    if (!file) return;
    setUploading(true); setError(null);
    try { setImageUrl(await uploadImage(file, 'categories')); }
    catch (err) { setError(err instanceof Error ? err.message : 'No se pudo subir la imagen.'); }
    finally { setUploading(false); }
  }

  const PreviewIcon = iconFor(icon);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{initial ? 'Editar categoría' : 'Nueva categoría'}</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" required placeholder="Albañilería" />
          </div>
          <div className="flex items-center gap-2 text-slate-500"><PreviewIcon className="h-5 w-5" /><span className="text-xs">Se generará una URL interna a partir del nombre.</span></div>
          <div>
            <label className="label">Imagen de categoría (opcional)</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-slate-600 hover:border-ink hover:text-ink"><Upload className="h-4 w-4" />{uploading ? 'Subiendo imagen...' : 'Subir imagen'}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => selectImage(e.target.files?.[0])} /></label>
            {imageUrl && <img src={imageUrl} alt="Vista previa" className="mt-2 h-24 w-full rounded-xl object-cover" />}
          </div>
          <div>
            <label className="label">Número de orden / prioridad</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="input" />
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
