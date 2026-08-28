import { ShoppingCart, Tag } from 'lucide-react';
import type { ProductWithCategory, SiteSettings } from '@/lib/types';

interface Props {
  products: ProductWithCategory[];
  loading: boolean;
  settings: SiteSettings;
  title?: string;
  onAdd: (product: ProductWithCategory) => void;
}

export function ProductGrid({ products, loading, title = 'Catálogo', onAdd }: Props) {
  if (loading) {
    return (
      <section className="container-app py-12">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="container-app py-16">
        <div className="grid place-items-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-lg font-semibold text-ink">No encontramos productos</p>
          <p className="mt-1 text-sm text-slate-500">Prueba con otra búsqueda o categoría.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="container-app py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{products.length} productos disponibles</p>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => {
          const inStock = p.stock > 0;
          return (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-slate-300">
                    <Tag className="h-10 w-10" />
                  </div>
                )}
                {p.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur">
                    {p.category.name}
                  </span>
                )}
                <span
                  className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    inStock ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                  }`}
                >
                  {inStock ? `Stock: ${p.stock}` : 'Agotado'}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-ink">{p.name}</h3>
                {p.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{p.description}</p>
                )}

                {p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {p.price != null && (
                  <p className="mt-3 text-lg font-bold text-ink">S/ {p.price.toFixed(2)}</p>
                )}

                <button disabled={!inStock} onClick={() => onAdd(p)} className="btn-ink mt-auto w-full disabled:cursor-not-allowed disabled:opacity-40">
                  <ShoppingCart className="h-4 w-4" /> {inStock ? 'Agregar' : 'Agotado'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
