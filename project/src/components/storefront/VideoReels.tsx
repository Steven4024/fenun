import { useState } from 'react';
import { Play, X } from 'lucide-react';
import type { Video } from '@/lib/types';

interface Props {
  videos: Video[];
}

export function VideoReels({ videos }: Props) {
  const [open, setOpen] = useState<Video | null>(null);

  return (
    <section className="border-y border-slate-100 bg-white py-12">
      <div className="container-app">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-ink">Novedades en video</h2>
          <p className="mt-1 text-sm text-slate-500">Mira lo recién llegado a la tienda</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setOpen(v)}
              className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-slate-900 shadow-card"
            >
              <video
                src={v.video_url}
                muted
                playsInline
                loop
                autoPlay
                className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink transition-transform group-hover:scale-110">
                <Play className="h-4 w-4 fill-current" />
              </div>
              {v.title && (
                <p className="absolute inset-x-3 bottom-3 text-sm font-semibold text-white drop-shadow">{v.title}</p>
              )}
            </button>
          ))}
          {videos.length === 0 && (
            <div className="col-span-full grid aspect-video place-items-center rounded-2xl bg-slate-50 text-sm text-slate-400">
              Pronto subiremos videos de novedades
            </div>
          )}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
          <video
            src={open.video_url}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] w-auto rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
