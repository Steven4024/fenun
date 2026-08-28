import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Store, ArrowRight } from 'lucide-react';
import type { Banner, SiteSettings } from '@/lib/types';

interface Props {
  banners: Banner[];
  settings: SiteSettings;
}

export function Hero({ banners, settings }: Props) {
  const active = banners.filter((b) => b.active).sort((a, b) => a.sort_order - b.sort_order);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (active.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % active.length), 5000);
    return () => clearInterval(t);
  }, [active.length]);

  const current = active[idx];

  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="container-app grid gap-5 py-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Rotating banners */}
        <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-900 shadow-card lg:aspect-[16/10]">
          {current ? (
            <a href={current.link_url ?? '#categorias'} className="block h-full w-full">
              <img
                key={current.id}
                src={current.image_url}
                alt={current.title ?? 'Banner FENUN'}
                className="h-full w-full object-cover animate-fade-up transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              {current.title && (
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <h2 className="max-w-lg text-2xl font-bold leading-tight text-white drop-shadow sm:text-3xl">
                    {current.title}
                  </h2>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                    Ver más <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              )}
            </a>
          ) : (
            <div className="grid h-full place-items-center text-slate-400">
              <p className="text-sm">Banners próximamente</p>
            </div>
          )}

          {active.length > 1 && (
            <>
              <button
                onClick={() => setIdx((i) => (i - 1 + active.length) % active.length)}
                className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIdx((i) => (i + 1) % active.length)}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {active.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                    aria-label={`Banner ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Store photo container */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 shadow-card">
          <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
            <Store className="h-3.5 w-3.5" /> Nuestro local
          </div>
          {settings.store_photo_url ? (
            <img
              src={settings.store_photo_url}
              alt={settings.store_photo_title ?? 'Local FENUN'}
              className="h-full min-h-[220px] w-full object-cover"
            />
          ) : (
            <div className="grid min-h-[220px] place-items-center p-6 text-center text-slate-400">
              <div>
                <MapPin className="mx-auto h-8 w-8" />
                <p className="mt-2 text-sm">Sube la foto de tu local desde el panel /admin</p>
              </div>
            </div>
          )}
          {settings.store_photo_title && settings.store_photo_url && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4">
              <p className="text-sm font-semibold text-white">{settings.store_photo_title}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
