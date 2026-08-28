import type { Brand } from '@/lib/types';

interface Props {
  brands: Brand[];
  activeBrand: string | null;
  onSelect: (brand: Brand | null) => void;
}

export function Brands({ brands, activeBrand, onSelect }: Props) {
  const DEFAULT_BRANDS: Brand[] = [
    { id: '1', name: 'Truper', logo_url: 'https://images.seeklogo.com/logo-png/43/1/truper-logo-png_seeklogo-434057.png', sort_order: 1, created_at: '' },
    { id: '2', name: 'Stanley', logo_url: 'https://images.seeklogo.com/logo-png/30/1/stanley-logo-png_seeklogo-305808.png', sort_order: 2, created_at: '' }
  ];

  const list = brands && brands.length > 0 ? brands : DEFAULT_BRANDS;
  const sorted = [...list].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="border-y border-slate-100 bg-white py-10">
      <div className="container-app">
        <h2 className="mb-6 text-center text-xl font-bold tracking-tight text-ink">
          Marcas con las que trabajamos
        </h2>

        {sorted.length === 0 ? (
          <p className="text-center text-sm text-slate-400">Pronto mostraremos nuestras marcas aliadas.</p>
        ) : (
          <div className="overflow-hidden" aria-label="Marcas aliadas">
            <div className="brand-marquee-track">
            {[...sorted, ...sorted].map((b, index) => (
              <button
                key={`${b.id}-${index}`}
                onClick={() => onSelect(activeBrand === b.id ? null : b)}
                className={`flex h-24 w-40 shrink-0 items-center justify-center p-4 transition-transform hover:scale-105 ${activeBrand === b.id ? 'scale-105' : ''}`}
                aria-label={`Filtrar por ${b.name}`}
              >
                {b.logo_url ? (
                  <img
                    src={b.logo_url}
                    alt={b.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold tracking-tight text-slate-400">{b.name}</span>
                )}
              </button>
            ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
