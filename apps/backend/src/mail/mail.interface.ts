export interface OrderEmailData {
  orderId: string;
  userEmail: string;
  userName: string;
  files: Array<{
    originalName: string;
    pages: number;
  }>;
  options: {
    size: string;
    isColor: boolean;
    isDuplex: boolean;
    quantity: number;
  };
  totalPrice: number;
  pickupDate?: string;
  pickupTime?: string;
  comment?: string;
}
