import type { Brand } from '@/lib/types';

interface Props {
  brands: Brand[];
}

export function Brands({ brands }: Props) {
  const sorted = [...brands].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="border-y border-slate-100 bg-white py-10">
      <div className="container-app">
        <h2 className="mb-6 text-center text-xl font-bold tracking-tight text-ink">
          Marcas con las que trabajamos
        </h2>

        {sorted.length === 0 ? (
          <p className="text-center text-sm text-slate-400">Pronto mostraremos nuestras marcas aliadas.</p>
        ) : (
          <div className="flex items-stretch gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {sorted.map((b) => (
              <div
                key={b.id}
                className="group flex h-24 w-40 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-canvas p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-card"
              >
                {b.logo_url ? (
                  <img
                    src={b.logo_url}
                    alt={b.name}
                    className="max-h-full max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                ) : (
                  <span className="text-lg font-bold tracking-tight text-slate-400">{b.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
