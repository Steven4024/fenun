import { X } from 'lucide-react';
import type { ProductWithCategory } from '@/lib/types';

export function ProductDetailsModal({ product, onClose, onAdd }: { product: ProductWithCategory | null; onClose: () => void; onAdd: (product: ProductWithCategory) => void }) {
  if (!product) return null;
  const inStock = product.stock > 0;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" onClick={onClose}>
    <section onClick={(event) => event.stopPropagation()} className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
      <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-ink shadow"><X className="h-5 w-5" /></button>
      <div className="grid sm:grid-cols-2"><div className="aspect-square bg-slate-100">{product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />}</div><div className="flex flex-col p-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{product.category?.name ?? 'Producto FENUN'}</p><h2 className="mt-2 text-2xl font-extrabold text-ink">{product.name}</h2>{product.price != null && <p className="mt-3 text-2xl font-extrabold text-ink">S/ {product.price.toFixed(2)}</p>}<div className="mt-5 flex-1"><h3 className="text-sm font-bold text-ink">Detalles técnicos</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{product.description || 'Consulta con nuestro equipo para conocer las especificaciones de este producto.'}</p></div><button disabled={!inStock} onClick={() => { onAdd(product); onClose(); }} className="btn-ink mt-6 w-full disabled:opacity-40">{inStock ? 'Agregar al carrito' : 'Producto agotado'}</button></div></div>
    </section>
  </div>;
}
