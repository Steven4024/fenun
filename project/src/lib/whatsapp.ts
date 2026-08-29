export const DEFAULT_WHATSAPP_NUMBER = '51927324371';

export function waLink(message: string, number: string = DEFAULT_WHATSAPP_NUMBER): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

export function quoteProductMessage(productName: string): string {
  return `Hola FENUN, deseo consultar sobre el producto: ${productName}. ¿Podrían darme más información?`;
}

export function quoteCartMessage(items: { name: string; price: number | null; quantity: number }[], document: string, receipt: string, payment: string, customerName = '', intent = 'Cotización', delivery = 'Recojo en tienda', location = ''): string {
  const lines = items.map((item, index) => `${index + 1}. ${item.name} × ${item.quantity}${item.price != null ? ` — S/ ${(item.price * item.quantity).toFixed(2)}` : ''}`);
  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  return `Hola, Ferretería FENUN.\n\n${intent.toUpperCase()}\n${lines.join('\n')}\n\nTOTAL GENERAL: S/ ${total.toFixed(2)}\n\nEntrega: ${delivery}${location ? `\nUbicación / referencia: ${location}` : ''}\n\nFacturación: ${receipt} | ${document}${customerName ? ` | ${customerName}` : ''}\nPago: ${payment}\n\nImportante: para procesar el pedido o despacho se requiere un adelanto del 50% vía Yape, Plin o transferencia bancaria.\n\nGracias por elegir FENUN.`;
}

export function generalContactMessage(): string {
  return 'Hola FENUN, deseo consultar sobre un producto.';
}
