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
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-110"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-30" />
      <svg
        className="relative h-8 w-8 fill-white"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.715-.515-5.267-1.41l-.378-.222-3.914 1.026 1.044-3.815-.248-.395A10.12 10.12 0 012.35 12c0-5.586 4.544-10.13 10.128-10.13 2.706 0 5.25 1.055 7.16 2.969a10.06 10.06 0 012.963 7.161c0 5.587-4.545 10.13-10.128 10.13m0-22C6.183.15.15 6.183.15 13.43c0 2.321.605 4.588 1.754 6.582L0 24l4.113-1.079a13.21 13.21 0 006.309 1.602c7.253 0 13.286-6.033 13.286-13.282C23.708 6.183 17.675.15 10.422.15z" />
      </svg>
    </a>
  );
}