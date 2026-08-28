import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import type { ProductWithCategory, SiteSettings } from '@/lib/types';
import { quoteCartMessage, waLink } from '@/lib/whatsapp';

export type CartItem = { product: ProductWithCategory; quantity: number };

interface Props {
  items: CartItem[];
  open: boolean;
  onClose: () => void;
  onQuantity: (id: string, quantity: number) => void;
  settings: SiteSettings;
}

export function CartDrawer({ items, open, onClose, onQuantity, settings }: Props) {
  const total = items.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-ink/40" onClick={onClose}>
      <aside onClick={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><ShoppingCart className="h-5 w-5" /> Mi carrito</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        {items.length === 0 ? <p className="py-12 text-center text-sm text-slate-500">Tu carrito está vacío.</p> : <>
          <div className="flex-1 space-y-3 overflow-y-auto py-4">
            {items.map(({ product, quantity }) => <div key={product.id} className="flex gap-3 rounded-xl border border-slate-100 p-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">{product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{product.name}</p><p className="text-sm font-bold text-ink">S/ {((product.price ?? 0) * quantity).toFixed(2)}</p>
                <div className="mt-2 flex items-center gap-2"><button onClick={() => onQuantity(product.id, quantity - 1)} className="rounded p-1 hover:bg-slate-100"><Minus className="h-3.5 w-3.5" /></button><span className="w-5 text-center text-sm">{quantity}</span><button disabled={quantity >= product.stock} onClick={() => onQuantity(product.id, quantity + 1)} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button><button onClick={() => onQuantity(product.id, 0)} className="ml-auto text-red-500"><Trash2 className="h-4 w-4" /></button></div>
              </div>
            </div>)}
          </div>
          <div className="border-t border-slate-100 pt-4"><div className="mb-4 flex justify-between text-lg font-bold text-ink"><span>Total</span><span>S/ {total.toFixed(2)}</span></div><Checkout items={items} settings={settings} /></div>
        </>}
      </aside>
    </div>
  );
}

function Checkout({ items, settings }: { items: CartItem[]; settings: SiteSettings }) {
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const document = String(form.get('document') ?? '');
    const receipt = String(form.get('receipt') ?? '');
    const payment = String(form.get('payment') ?? '');
    window.open(waLink(quoteCartMessage(items.map(({ product, quantity }) => ({ ...product, quantity })), document, receipt, payment), settings.whatsapp_number), '_blank', 'noopener,noreferrer');
  };
  return <form onSubmit={submit} className="space-y-3">
    <input name="document" required pattern="[0-9]{8}|[0-9]{11}" title="Ingresa un DNI de 8 dígitos o RUC de 11 dígitos" className="input" placeholder="DNI o RUC" />
    <div className="grid grid-cols-2 gap-3"><select name="receipt" required className="input"><option value="Boleta">Boleta</option><option value="Factura">Factura</option></select><select name="payment" required className="input"><option value="Contado">Contado</option><option value="Yape">Yape</option><option value="Plin">Plin</option></select></div>
    <button className="btn-wa w-full" type="submit">Enviar cotización</button>
  </form>;
}
