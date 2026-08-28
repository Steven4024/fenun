import { iconFor } from '@/lib/icons';
import type { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  active: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryCircles({ categories, active, onSelect }: Props) {
  if (active) return null;
  return <section id="categorias" className="container-app py-12">
    <div className="mb-6"><h2 className="text-2xl font-bold tracking-tight text-ink">Categorías</h2><p className="mt-1 text-sm text-slate-500">Explora nuestros productos por área</p></div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => { const Icon = iconFor(category.icon); return <button key={category.id} onClick={() => onSelect(category.slug)} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-card transition hover:-translate-y-1 hover:shadow-cardHover">
        <div className="aspect-[4/3] bg-slate-100">{category.image_url ? <img src={category.image_url} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <span className="grid h-full place-items-center text-slate-300"><Icon className="h-10 w-10" /></span>}</div>
        <p className="p-3 text-sm font-bold text-ink">{category.name}</p>
      </button>; })}
    </div>
  </section>;
}
