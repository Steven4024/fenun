import { useState } from 'react';
import { Loader2, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import type { ProductWithCategory, SiteSettings } from '@/lib/types';
import { quoteCartMessage, waLink } from '@/lib/whatsapp';
import { lookupDocument } from '@/lib/documentLookup';

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
    <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" onClick={onClose}>
      <aside onClick={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-ink to-slate-700 px-6 py-5 text-white">
          <div><h2 className="flex items-center gap-2 text-xl font-extrabold"><ShoppingCart className="h-5 w-5" /> Mi carrito</h2><p className="mt-1 text-xs text-white/70">Revisa tus productos antes de enviarnos tu solicitud.</p></div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        {items.length === 0 ? <p className="py-12 text-center text-sm text-slate-500">Tu carrito está vacío.</p> : <>
          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
            {items.map(({ product, quantity }) => <div key={product.id} className="flex gap-3 rounded-2xl border border-slate-200 p-3 shadow-sm">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">{product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{product.name}</p><p className="text-sm font-bold text-ink">S/ {((product.price ?? 0) * quantity).toFixed(2)}</p>
                <div className="mt-2 flex items-center gap-2"><button onClick={() => onQuantity(product.id, quantity - 1)} className="rounded p-1 hover:bg-slate-100"><Minus className="h-3.5 w-3.5" /></button><span className="w-5 text-center text-sm">{quantity}</span><button disabled={quantity >= product.stock} onClick={() => onQuantity(product.id, quantity + 1)} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button><button onClick={() => onQuantity(product.id, 0)} className="ml-auto text-red-500"><Trash2 className="h-4 w-4" /></button></div>
              </div>
            </div>)}
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-5"><div className="mb-5 flex items-center justify-between rounded-2xl bg-ink px-5 py-4 text-white"><span className="text-sm font-semibold">Total estimado</span><span className="text-2xl font-extrabold">S/ {total.toFixed(2)}</span></div><Checkout items={items} settings={settings} /></div>
        </>}
      </aside>
    </div>
  );
}

function Checkout({ items, settings }: { items: CartItem[]; settings: SiteSettings }) {
  const [document, setDocument] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [lookupStatus, setLookupStatus] = useState('');
  const [intent, setIntent] = useState('Cotización');
  const [delivery, setDelivery] = useState('Recojo en tienda');
  const [location, setLocation] = useState('Local FENUN');
  const lookup = async (value: string) => {
    if (value.length !== 8 && value.length !== 11) return;
    setLookupStatus('Consultando datos...'); setCustomerName('');
    try { setCustomerName(await lookupDocument(value)); setLookupStatus('Datos encontrados'); }
    catch (err) { setLookupStatus(err instanceof Error ? err.message : 'No se pudo consultar el documento.'); }
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const document = String(form.get('document') ?? '');
    const receipt = String(form.get('receipt') ?? '');
    const payment = String(form.get('payment') ?? '');
    window.open(waLink(quoteCartMessage(items.map(({ product, quantity }) => ({ ...product, quantity })), document, receipt, payment, customerName, intent, delivery, location), settings.whatsapp_number), '_blank', 'noopener,noreferrer');
  };
  return <form onSubmit={submit} className="space-y-3">
    <div><label className="label">Solicitud</label><div className="grid grid-cols-2 rounded-xl border border-slate-200 p-1"><button type="button" onClick={() => setIntent('Cotización')} className={`rounded-lg px-3 py-2 text-sm font-bold ${intent === 'Cotización' ? 'bg-ink text-white' : 'text-slate-500'}`}>Cotización</button><button type="button" onClick={() => setIntent('Pedido en Firme')} className={`rounded-lg px-3 py-2 text-sm font-bold ${intent === 'Pedido en Firme' ? 'bg-ink text-white' : 'text-slate-500'}`}>Pedido en firme</button></div></div>
    <div><input name="document" value={document} onChange={(event) => { const value = event.target.value.replace(/\D/g, '').slice(0, 11); setDocument(value); if (value.length === 8 || value.length === 11) void lookup(value); else { setCustomerName(''); setLookupStatus(''); } }} required pattern="[0-9]{8}|[0-9]{11}" title="Ingresa un DNI de 8 dígitos o RUC de 11 dígitos" className="input" placeholder="DNI o RUC" />
      {lookupStatus && <p className={`mt-1 flex items-center gap-1 text-xs ${customerName ? 'text-emerald-700' : 'text-slate-500'}`}>{lookupStatus === 'Consultando datos...' && <Loader2 className="h-3 w-3 animate-spin" />}{lookupStatus}</p>}
      {customerName && <input name="customer_name" readOnly value={customerName} className="input mt-2 bg-emerald-50 text-emerald-900" aria-label="Nombre autocompletado" />}</div>
    <div className="grid grid-cols-2 gap-3"><select name="receipt" required className="input"><option value="Boleta">Boleta</option><option value="Factura">Factura</option></select><select name="payment" required className="input"><option value="Contado">Contado</option><option value="Yape">Yape</option><option value="Plin">Plin</option></select></div>
    <div><label className="label">Modalidad de entrega</label><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => { setDelivery('Delivery a obra / domicilio'); setLocation(''); }} className={`rounded-xl border px-3 py-2 text-xs font-bold ${delivery.startsWith('Delivery') ? 'border-ink bg-ink text-white' : 'border-slate-200 bg-white text-slate-600'}`}>Delivery a obra / domicilio</button><button type="button" onClick={() => { setDelivery('Recojo en tienda'); setLocation('Local FENUN'); }} className={`rounded-xl border px-3 py-2 text-xs font-bold ${delivery === 'Recojo en tienda' ? 'border-ink bg-ink text-white' : 'border-slate-200 bg-white text-slate-600'}`}>Recojo en tienda</button></div><input required value={location} onChange={(event) => setLocation(event.target.value)} className="input mt-2" placeholder={delivery.startsWith('Delivery') ? 'Dirección o enlace de Google Maps' : 'Referencia del local'} /></div>
    <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">Para procesar el pedido o despacho se requiere un adelanto del 50% vía Yape, Plin o transferencia bancaria.</p>
    <button className="btn-wa w-full py-3 text-base shadow-lg" type="submit">Enviar {intent.toLowerCase()}</button>
  </form>;
}
