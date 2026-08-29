import { LayoutGrid, List, ShoppingCart, Tag } from 'lucide-react';
import type { ProductWithCategory, SiteSettings } from '@/lib/types';

interface Props {
  products: ProductWithCategory[];
  loading: boolean;
  settings: SiteSettings;
  title?: string;
  onAdd: (product: ProductWithCategory) => void;
  onDetails: (product: ProductWithCategory) => void;
  view?: 'grid' | 'list';
  onView?: (view: 'grid' | 'list') => void;
}

export function ProductGrid({ products, loading, title = 'Catálogo', onAdd, onDetails, view = 'grid', onView }: Props) {
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
      <div className="mb-6 flex items-end justify-between gap-3">
        <div><h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2><p className="mt-1 text-sm text-slate-500">{products.length} productos disponibles</p></div>
        {onView && <div className="flex rounded-lg border border-slate-200 p-1"><button onClick={() => onView('grid')} aria-label="Vista de cuadrícula" className={`rounded p-2 ${view === 'grid' ? 'bg-ink text-white' : 'text-slate-500'}`}><LayoutGrid className="h-4 w-4" /></button><button onClick={() => onView('list')} aria-label="Vista de lista" className={`rounded p-2 ${view === 'list' ? 'bg-ink text-white' : 'text-slate-500'}`}><List className="h-4 w-4" /></button></div>}
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4' : 'space-y-3'}>
        {products.map((p) => {
          const inStock = p.stock > 0;
          const lowStock = inStock && p.stock < 5;
          const featured = p.tags.includes('featured');
          const visibleTags = p.tags.filter((tag) => !tag.startsWith('brand:') && tag !== 'featured');
          return (
            <article
              key={p.id}
              className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:shadow-cardHover ${view === 'grid' ? 'flex flex-col hover:-translate-y-1' : 'flex gap-4 p-3 sm:items-center'}`}
            >
              <div className={`relative overflow-hidden bg-slate-100 ${view === 'grid' ? 'aspect-square' : 'h-24 w-24 shrink-0 rounded-xl'}`}>
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
                {featured && <span className="absolute bottom-3 left-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-extrabold text-amber-950">OFERTA DEL MES</span>}
                <span
                  className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    lowStock ? 'bg-orange-500 text-white' : inStock ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                  }`}
                >
                  {lowStock ? `¡Últimas ${p.stock}!` : inStock ? `Stock: ${p.stock}` : 'Agotado'}
                </span>
              </div>

              <div className={`flex flex-1 flex-col ${view === 'grid' ? 'p-4' : 'min-w-0 py-1 pr-2'}`}>
                <button onClick={() => onDetails(p)} className="line-clamp-2 text-left text-sm font-semibold text-ink hover:underline">{p.name}</button>
                {p.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{p.description}</p>
                )}

                {visibleTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {visibleTags.map((t) => (
                      <span key={t} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {p.price != null && (
                  <p className="mt-3 text-lg font-bold text-ink">S/ {p.price.toFixed(2)}</p>
                )}

                <button onClick={() => onDetails(p)} className="mt-3 text-left text-xs font-bold text-slate-600 underline underline-offset-2 hover:text-ink">Ver detalles</button>

                <button disabled={!inStock} onClick={() => onAdd(p)} className={`btn-ink mt-auto disabled:cursor-not-allowed disabled:opacity-40 ${view === 'grid' ? 'w-full' : 'mt-3 sm:absolute sm:right-5 sm:w-32'}`}>
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
