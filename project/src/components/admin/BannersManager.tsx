import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Banner } from '@/lib/types';

export function BannersManager() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('banners').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('¿Eliminar este banner?')) return;
    await supabase.from('banners').delete().eq('id', id);
    load();
  }

  async function toggle(b: Banner) {
    await supabase.from('banners').update({ active: !b.active }).eq('id', b.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Banners</h1>
          <p className="mt-1 text-sm text-slate-500">Banners rotativos de la portada</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-ink"><Plus className="h-4 w-4" /> Nuevo</button>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((b) => (
            <div key={b.id} className={`card overflow-hidden ${b.active ? '' : 'opacity-60'}`}>
              <div className="relative aspect-[16/9] bg-slate-100">
                <img src={b.image_url} alt={b.title ?? ''} className="h-full w-full object-cover" />
                <div className="absolute right-2 top-2 flex gap-1">
                  <button onClick={() => toggle(b)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-600 hover:text-ink">
                    {b.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => { setEditing(b); setShowForm(true); }} className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-600 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(b.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-ink">{b.title ?? 'Sin título'}</p>
                <p className="text-xs text-slate-400">Orden {b.sort_order} · {b.active ? 'Activo' : 'Inactivo'}</p>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-slate-500">Aún no hay banners.</p>}
        </div>
      )}

      {showForm && (
        <BannerForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />
      )}
    </div>
  );
}

function BannerForm({ initial, onClose, onSaved }: { initial: Banner | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '');
  const [linkUrl, setLinkUrl] = useState(initial?.link_url ?? '');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [active, setActive] = useState(initial?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { title: title || null, image_url: imageUrl, link_url: linkUrl || null, sort_order: sortOrder, active };
    let res;
    if (initial) res = await supabase.from('banners').update(payload).eq('id', initial.id);
    else res = await supabase.from('banners').insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{initial ? 'Editar banner' : 'Nuevo banner'}</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Taladros percutores" />
          </div>
          <div>
            <label className="label">URL de la imagen (16:9)</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input" required placeholder="https://..." />
            {imageUrl && <img src={imageUrl} alt="preview" className="mt-2 aspect-video w-full rounded-xl object-cover" />}
          </div>
          <div>
            <label className="label">Enlace al hacer clic (opcional)</label>
            <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="input" placeholder="#categorias" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="label">Orden</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="input" />
            </div>
            <label className="mt-5 flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded" /> Activo
            </label>
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
