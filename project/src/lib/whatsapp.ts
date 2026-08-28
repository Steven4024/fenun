export const DEFAULT_WHATSAPP_NUMBER = '51927324371';

export function waLink(message: string, number: string = DEFAULT_WHATSAPP_NUMBER): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

export function quoteProductMessage(productName: string): string {
  return `Hola FENUN, deseo consultar sobre el producto: ${productName}. ¿Podrían darme más información?`;
}

export function quoteCartMessage(items: { name: string; price: number | null; quantity: number }[], document: string, receipt: string, payment: string, customerName = ''): string {
  const lines = items.map((item, index) => `${index + 1}. ${item.name}\n   Cantidad: ${item.quantity}${item.price != null ? ` | Precio unitario: S/ ${item.price.toFixed(2)}\n   Subtotal: S/ ${(item.price * item.quantity).toFixed(2)}` : ''}`);
  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  return `Hola, Ferretería FENUN.\n\nSolicito por favor la siguiente cotización:\n\n${lines.join('\n\n')}\n\nTOTAL GENERAL: S/ ${total.toFixed(2)}\n\nDatos de facturación\nDocumento: ${document}${customerName ? `\nCliente: ${customerName}` : ''}\nComprobante: ${receipt}\nMétodo de pago: ${payment}\n\nQuedo atento(a) a su confirmación. Muchas gracias.`;
}

export function generalContactMessage(): string {
  return 'Hola FENUN, deseo consultar sobre un producto.';
}
