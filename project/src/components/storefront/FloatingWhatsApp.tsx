import { MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';
import { waLink, generalContactMessage } from '@/lib/whatsapp';

interface Props {
  settings: SiteSettings;
}

export function FloatingWhatsApp({ settings }: Props) {
  return (
    <a
      href={waLink(generalContactMessage(), settings.whatsapp_number)}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg transition-all hover:scale-110 hover:bg-whatsapp-dark active:scale-95"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-30" />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  );
}
