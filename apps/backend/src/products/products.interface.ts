export interface CalculatePriceDto {
  productId: string;
  selectedOptions: Record<string, string>; // { optionName: value }
  quantity?: number;
}
