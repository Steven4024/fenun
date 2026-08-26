import { Search, MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';
import { waLink, generalContactMessage } from '@/lib/whatsapp';

interface Props {
  query: string;
  onQuery: (q: string) => void;
  onLogo: () => void;
  settings: SiteSettings;
}

export function Header({ query, onQuery, onLogo, settings }: Props) {
  const wa = waLink(generalContactMessage(), settings.whatsapp_number);
  const hasLogo = Boolean(settings.logo_url);

  return (
    <header className="sticky top-0 z-40">
      {/* Top announcement bar — slogan with institutional contrast */}
      <div className="bg-gradient-to-r from-ink via-slate-800 to-ink text-white">
        <p className="container-app py-2 text-center text-xs font-semibold tracking-wide sm:text-sm">
          {settings.slogan}
        </p>
      </div>

      {/* Main nav */}
      <div className="border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="container-app flex h-16 items-center gap-3">
          <button onClick={onLogo} className="flex shrink-0 items-center gap-2" aria-label="Ir al inicio">
            <img
              src="https://i.ibb.co/JF2j5XwX/logo-simple.jpg"
              alt="Emblema FENUN"
              className="h-10 w-auto object-contain rounded-full"
            />
            <span className="text-xl font-extrabold tracking-tight text-ink">FENUN</span>
          </button>


          <div className="relative mx-auto hidden w-full max-w-xl md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-700" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar productos: malla raschel, taladro, amoladora, grass sintético..."
              className="w-full rounded-full border-2 border-slate-900 bg-white py-2 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <a href={wa} target="_blank" rel="noreferrer" className="btn-wa ml-auto shrink-0">
            <svg
              className="h-4 w-4 fill-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.715-.515-5.267-1.41l-.378-.222-3.914 1.026 1.044-3.815-.248-.395A10.12 10.12 0 012.35 12c0-5.586 4.544-10.13 10.128-10.13 2.706 0 5.25 1.055 7.16 2.969a10.06 10.06 0 012.963 7.161c0 5.587-4.545 10.13-10.128 10.13m0-22C6.183.15.15 6.183.15 13.43c0 2.321.605 4.588 1.754 6.582L0 24l4.113-1.079a13.21 13.21 0 006.309 1.602c7.253 0 13.286-6.033 13.286-13.282C23.708 6.183 17.675.15 10.422.15z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>

        <div className="container-app pb-2.5 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-full border border-slate-200 bg-canvas py-2 pl-11 pr-4 text-sm placeholder:text-slate-400 focus:border-ink focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </header >
  );
}
