export const DEFAULT_WHATSAPP_NUMBER = '51927324371';

export function waLink(message: string, number: string = DEFAULT_WHATSAPP_NUMBER): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

export function quoteProductMessage(productName: string): string {
  return `Hola FENUN, deseo consultar sobre el producto: ${productName}. ¿Podrían darme más información?`;
}

export function generalContactMessage(): string {
  return 'Hola FENUN, deseo consultar sobre un producto.';
}
