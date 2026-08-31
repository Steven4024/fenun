import { ArrowLeft } from 'lucide-react';
import type { Category } from '@/lib/types';

export function CategoryHero({ category, onBack }: { category: Category; onBack: () => void }) {
  return (
    <section className="container-app pt-6">
      <div className="relative h-[48vh] min-h-[350px] w-full overflow-hidden rounded-2xl shadow-lg">
        {category.image_url && (
          <img 
            src={category.image_url} 
            alt={category.name} 
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 self-start rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar al inicio
          </button>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Categoría</span>
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl mt-1">
              {category.name}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}