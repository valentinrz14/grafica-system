export enum OrderStatus {
  PENDING = 'PENDING',
  PRINTING = 'PRINTING',
  DONE = 'DONE',
}

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  CARTA = 'CARTA',
}

export interface OrderOptions {
  size: PaperSize;
  isColor: boolean;
  isDuplex: boolean;
  quantity: number;
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

export interface UploadedFile {
  id: string;
  fileName: string;
  fileUrl: string;
  pages: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  userEmail: string;
  status: OrderStatus;
  totalPrice: number;
  options: OrderOptions;
  files: UploadedFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDto {
  userEmail: string;
  options: OrderOptions;
  fileIds: string[];
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface CalculatePriceDto {
  pages: number;
  options: OrderOptions;
}

export interface CalculatePriceResponse {
  priceBreakdown: PriceBreakdown;
}
