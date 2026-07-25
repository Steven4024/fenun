import { useEffect, useState } from 'react';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data as SiteSettings);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    const { error } = await supabase.from('site_settings').update({
      logo_url: settings.logo_url,
      store_photo_url: settings.store_photo_url,
      store_photo_title: settings.store_photo_title,
      whatsapp_number: settings.whatsapp_number,
      slogan: settings.slogan,
    }).eq('id', 1);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!settings) return <p className="text-sm text-slate-400">Cargando...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-ink">Ajustes del sitio</h1>
      <p className="mt-1 text-sm text-slate-500">Logo oficial, foto del local, WhatsApp y eslogan</p>

      <form onSubmit={save} className="mt-6 space-y-6">
        {/* Logo */}
        <fieldset className="card p-5">
          <legend className="px-2 text-sm font-bold text-ink">Logo de la marca</legend>
          <div className="mt-3 flex items-center gap-4">
            <div className="grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-canvas">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <ImageIcon className="h-6 w-6 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <label className="label">URL del logo</label>
              <input
                value={settings.logo_url ?? ''}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value || null })}
                className="input"
                placeholder="https://... (sube la imagen y pega el enlace)"
              />
              <p className="mt-1 text-xs text-slate-400">Pega aquí la URL del emblema plateado de FENUN.</p>
            </div>
          </div>
        </fieldset>

        {/* Store photo */}
        <fieldset className="card p-5">
          <legend className="px-2 text-sm font-bold text-ink">Foto del local físico</legend>
          <div className="mt-3 flex items-center gap-4">
            <div className="grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-canvas">
              {settings.store_photo_url ? (
                <img src={settings.store_photo_url} alt="Local" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-6 w-6 text-slate-300" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="label">URL de la foto</label>
                <input
                  value={settings.store_photo_url ?? ''}
                  onChange={(e) => setSettings({ ...settings, store_photo_url: e.target.value || null })}
                  className="input"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="label">Título (opcional)</label>
                <input
                  value={settings.store_photo_title ?? ''}
                  onChange={(e) => setSettings({ ...settings, store_photo_title: e.target.value || null })}
                  className="input"
                  placeholder="Local FENUN Chulucanas"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Contact + slogan */}
        <fieldset className="card p-5">
          <legend className="px-2 text-sm font-bold text-ink">Contacto y eslogan</legend>
          <div className="mt-3 space-y-4">
            <div>
              <label className="label">Número de WhatsApp (con código de país, sin +)</label>
              <input
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value || DEFAULT_WHATSAPP_NUMBER })}
                className="input"
                placeholder="51927324371"
              />
            </div>
            <div>
              <label className="label">Eslogan</label>
              <input
                value={settings.slogan}
                onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                className="input"
                placeholder="Una familia pensando en tu familia"
              />
            </div>
          </div>
        </fieldset>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {saved && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Cambios guardados.</p>}

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-ink disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
        <Upload className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Para subir el logo o la foto del local: pega la URL directa de la imagen (terminada en .png, .jpg, etc.) en el campo correspondiente. Si la imagen está en tu computadora, súbela primero a un servicio de imágenes y copia el enlace aquí.</p>
      </div>
    </div>
  );
}
