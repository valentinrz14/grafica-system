import { OrderOptions, PriceBreakdown } from '@/lib/api-client';

export interface PriceCalculatorProps {
  options: OrderOptions;
  onOptionsChange: (options: OrderOptions) => void;
  priceBreakdown: PriceBreakdown | null;
  isCalculating: boolean;
  totalPages: number;
}
