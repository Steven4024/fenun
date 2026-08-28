import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { StorePhoto } from '@/lib/types';
import { uploadImage } from '@/lib/storage';

export function StorePhotosManager() {
  const [items, setItems] = useState<StorePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StorePhoto | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('store_photos').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('¿Eliminar esta foto?')) return;
    await supabase.from('store_photos').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Fotos de locales</h1>
          <p className="mt-1 text-sm text-slate-500">Aparecen en la portada de la tienda</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-ink"><Plus className="h-4 w-4" /> Nueva</button>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="relative aspect-video bg-slate-100">
                {p.image_url && <img src={p.image_url} alt={p.title ?? ''} className="h-full w-full object-cover" />}
                <div className="absolute right-2 top-2 flex gap-1">
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-600 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(p.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-ink">{p.title ?? 'Sin título'}</p>
                <p className="text-xs text-slate-400">Orden {p.sort_order}</p>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-slate-500">Aún no hay fotos.</p>}
        </div>
      )}

      {showForm && (
        <PhotoForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />
      )}
    </div>
  );
}

function PhotoForm({ initial, onClose, onSaved }: { initial: StorePhoto | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!imageUrl) { setError('Selecciona una imagen del local.'); return; }
      const payload = { title: title || null, image_url: imageUrl, sort_order: sortOrder };
      const res = initial ? await supabase.from('store_photos').update(payload).eq('id', initial.id) : await supabase.from('store_photos').insert(payload);
      if (res.error) { setError(res.error.message); return; }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
    } finally { setSaving(false); }
  }

  async function selectImage(file: File | undefined) { if (!file) return; setUploading(true); setError(null); try { setImageUrl(await uploadImage(file, 'store-photos')); } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo subir la imagen.'); } finally { setUploading(false); } }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{initial ? 'Editar foto' : 'Nueva foto'}</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Local Central" />
          </div>
          <div>
            <label className="label">Imagen del local</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-slate-600 hover:border-ink hover:text-ink">
              <Upload className="h-4 w-4" /> {uploading ? 'Subiendo imagen...' : 'Subir imagen'}
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => selectImage(e.target.files?.[0])} />
            </label>
            {imageUrl && <img src={imageUrl} alt="preview" className="mt-2 h-24 w-full rounded-xl object-cover" />}
          </div>
          <div>
            <label className="label">Orden</label>
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
