const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface OrderOptions {
  size: 'A4' | 'A3' | 'CARTA';
  isColor: boolean;
  isDuplex: boolean;
  quantity: number;
}

export interface UploadedFile {
  id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  pages: number;
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

export interface Order {
  id: string;
  userEmail: string;
  status: 'PENDING' | 'PRINTING' | 'DONE';
  totalPrice: number;
  options: OrderOptions;
  files: UploadedFile[];
  comment?: string;
  pickupDate?: string;
  pickupTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  userEmail: string;
  options: OrderOptions;
  files: UploadedFile[];
  comment?: string;
  pickupDate?: string;
  pickupTime?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async uploadFile(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/files/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file');
    }

    const result = await response.json();
    return result.data;
  }

  async calculatePrice(
    files: UploadedFile[],
    options: OrderOptions,
  ): Promise<PriceBreakdown> {
    const response = await fetch(`${this.baseUrl}/orders/calculate-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: files.map((f) => ({ pages: f.pages })),
        options,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to calculate price');
    }

    const result = await response.json();
    return result.data;
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }

    const result = await response.json();
    return result.data;
  }

  async getOrders(): Promise<Order[]> {
    const url = `${this.baseUrl}/orders`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('🔴 getOrders: Error response:', error);
      throw new Error(error.message || 'Failed to fetch orders');
    }

    const result = await response.json();
    return result.data;
  }

  async getMyOrders(): Promise<Order[]> {
    const url = `${this.baseUrl}/orders/my-orders`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('🔴 getMyOrders: Error response:', error);
      throw new Error(error.message || 'Failed to fetch your orders');
    }

    const result = await response.json();
    return result.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/orders/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch order');
    }

    const result = await response.json();
    return result.data;
  }

  async updateOrderStatus(
    id: string,
    status: 'PENDING' | 'PRINTING' | 'DONE',
  ): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/orders/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update order status');
    }

    const result = await response.json();
    return result.data;
  }

  getFileUrl(fileUrl: string): string {
    return `${this.baseUrl}${fileUrl}`;
  }
}

export const apiClient = new ApiClient();
