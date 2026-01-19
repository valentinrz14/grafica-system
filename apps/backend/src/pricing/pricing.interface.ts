export interface CalculatePriceOptions {
  pages: number;
  isColor: boolean;
  isDuplex: boolean;
  quantity?: number; // Opcional, siempre será 1
}

export interface PriceBreakdown {
  basePrice: number;
  pages: number;
  quantity: number;
  colorMultiplier: number;
  duplexMultiplier: number;
  subtotal: number;
  total: number;
}
