import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Brand } from '@/lib/types';

export function BrandsManager() {
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('brands').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('¿Eliminar esta marca?')) return;
    await supabase.from('brands').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Marcas aliadas</h1>
          <p className="mt-1 text-sm text-slate-500">"Marcas con las que trabajamos"</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-ink"><Plus className="h-4 w-4" /> Nueva</button>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((b) => (
            <div key={b.id} className="card flex items-center gap-3 p-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-canvas">
                {b.logo_url ? <img src={b.logo_url} alt={b.name} className="max-h-full max-w-full object-contain" /> : <span className="text-sm font-bold text-slate-400">{b.name.slice(0, 3)}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{b.name}</p>
                <p className="text-xs text-slate-400">Orden {b.sort_order}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(b); setShowForm(true); }} className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-ink"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(b.id)} className="grid h-7 w-7 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-slate-500">Aún no hay marcas.</p>}
        </div>
      )}

      {showForm && (
        <BrandForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />
      )}
    </div>
  );
}

function BrandForm({ initial, onClose, onSaved }: { initial: Brand | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url ?? '');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { name, logo_url: logoUrl || null, sort_order: sortOrder };
    let res;
    if (initial) res = await supabase.from('brands').update(payload).eq('id', initial.id);
    else res = await supabase.from('brands').insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{initial ? 'Editar marca' : 'Nueva marca'}</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" required placeholder="EMTOP" />
          </div>
          <div>
            <label className="label">URL del logo (opcional)</label>
            <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="input" placeholder="https://..." />
            {logoUrl && <img src={logoUrl} alt="preview" className="mt-2 grid h-16 w-24 place-items-center rounded-lg bg-canvas object-contain p-2" />}
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
