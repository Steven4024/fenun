import { iconFor } from '@/lib/icons';
import type { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  active: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryCircles({ categories, active, onSelect }: Props) {
  return (
    <section id="categorias" className="container-app py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">Categorías</h2>
          <p className="mt-1 text-sm text-slate-500">Explora nuestros productos por área</p>
        </div>
        {active && (
          <button onClick={() => onSelect(null)} className="text-sm font-semibold text-ink underline-offset-4 hover:underline">
            Ver todo
          </button>
        )}
      </div>

      <div className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const Icon = iconFor(c.icon);
          const isActive = active === c.slug;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(isActive ? null : c.slug)}
              className="group flex shrink-0 flex-col items-center gap-3"
            >
              <div
                className={`grid h-20 w-20 place-items-center rounded-full border-2 transition-all duration-300 group-hover:scale-105 ${
                  isActive
                    ? 'border-ink bg-ink text-white shadow-md'
                    : 'border-slate-200 bg-white text-ink group-hover:border-slate-300'
                }`}
              >
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <Icon className="h-7 w-7" />
                )}
              </div>
              <span className={`max-w-[80px] text-center text-xs font-medium ${isActive ? 'text-ink' : 'text-slate-600'}`}>
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
