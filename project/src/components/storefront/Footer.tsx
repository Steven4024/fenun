import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import type { SiteSettings, Category } from '@/lib/types';
import { waLink, generalContactMessage } from '@/lib/whatsapp';

interface Props {
  settings: SiteSettings;
  categories: Category[];
}

export function Footer({ settings, categories }: Props) {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-app grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="FENUN" className="h-12 w-auto max-w-[150px] object-contain" />
          ) : (
            <span className="text-xl font-extrabold tracking-tight text-ink">FENUN</span>
          )}
          <p className="mt-3 text-sm text-slate-500">Ferretería con calidad, variedad y confianza para tus proyectos.</p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ink">Visítanos</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Calle Colón con Piura, Chulucanas - Piura (1er piso del edificio de 5 pisos)</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
             <span>Lun–Dom 7:30 am – 6:00 pm</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ink">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> (073) 615106</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> +51 927 324 371</li>
            <li>
              <a
                href={waLink(generalContactMessage(), settings.whatsapp_number)}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-whatsapp-dark hover:underline"
              >
                Escríbenos por WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ink">Categorías</h4>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-500">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <a href="#categorias" className="hover:text-ink hover:underline">{c.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} FENUN. Todos los derechos reservados.
      </div>
    </footer>
  );
}
