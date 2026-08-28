import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Video } from '@/lib/types';
import { uploadVideo } from '@/lib/storage';

export function VideosManager() {
  const [items, setItems] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Video | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('¿Eliminar este video?')) return;
    await supabase.from('videos').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Videos de novedades</h1>
          <p className="mt-1 text-sm text-slate-500">Reels verticales que se muestran en la tienda</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-ink"><Plus className="h-4 w-4" /> Nuevo</button>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[9/16] animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((v) => (
            <div key={v.id} className="card overflow-hidden">
              <div className="relative aspect-[9/16] bg-slate-900">
                {v.video_url && <video src={v.video_url} muted loop autoPlay playsInline className="h-full w-full object-cover" />}
                <div className="absolute right-2 top-2 flex gap-1">
                  <button onClick={() => { setEditing(v); setShowForm(true); }} className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-600 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(v.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-ink">{v.title ?? 'Sin título'}</p>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-slate-500">Aún no hay videos.</p>}
        </div>
      )}

      {showForm && (
        <VideoForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />
      )}
    </div>
  );
}

function VideoForm({ initial, onClose, onSaved }: { initial: Video | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [videoUrl, setVideoUrl] = useState(initial?.video_url ?? '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { title: title || null, video_url: videoUrl };
    let res;
    if (initial) res = await supabase.from('videos').update(payload).eq('id', initial.id);
    else res = await supabase.from('videos').insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    onSaved();
  }

  async function selectVideo(file: File | undefined) { if (!file) return; setUploading(true); setError(null); try { setVideoUrl(await uploadVideo(file, 'videos')); } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo subir el video.'); } finally { setUploading(false); } }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{initial ? 'Editar video' : 'Nuevo video'}</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Llegó: Taladro 20V" />
          </div>
          <div>
            <label className="label">Video</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-slate-600 hover:border-ink hover:text-ink"><Upload className="h-4 w-4" />{uploading ? 'Subiendo video...' : 'Subir video'}<input type="file" accept="video/*" className="hidden" disabled={uploading} onChange={(e) => selectVideo(e.target.files?.[0])} /></label>
            {videoUrl && <video src={videoUrl} muted loop autoPlay playsInline className="mt-2 aspect-[9/16] h-40 rounded-xl object-cover" />}
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
