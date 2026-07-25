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
            {hasLogo ? (
              <img
                src={settings.logo_url!}
                alt="FENUN"
                className="h-11 w-auto max-w-[180px] object-contain"
              />
            ) : (
              <>
                <img
                  src="/images/image.png"
                  alt=""
                  aria-hidden="true"
                  className="w-auto object-contain"
                  style={{ height: '1.25rem' }}
                />
                <span className="text-xl font-extrabold tracking-tight text-ink">FENUN</span>
              </>
            )}
          </button>

          <div className="relative mx-auto hidden w-full max-w-xl md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar productos: taladro, amoladora, malla..."
              className="w-full rounded-full border border-slate-200 bg-canvas py-2 pl-11 pr-4 text-sm text-ink placeholder:text-slate-400 transition-colors focus:border-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </div>

          <a href={wa} target="_blank" rel="noreferrer" className="btn-wa ml-auto shrink-0">
            <MessageCircle className="h-4 w-4" />
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
    </header>
  );
}
