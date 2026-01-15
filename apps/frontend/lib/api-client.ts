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
  status: 'PENDING' | 'PRINTING' | 'DONE' | 'EXPIRED';
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

  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      // Si es 401, significa que el token expiró o no es válido
      if (response.status === 401) {
        // Limpiar el localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');

          // Redirigir automáticamente al login
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
        // Lanzar error para detener la ejecución
        throw new Error('AUTH_EXPIRED');
      }

      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
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

    const result = await this.handleResponse(response);
    return result.data;
  }

  async getOrders(): Promise<Order[]> {
    const url = `${this.baseUrl}/orders`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    const result = await this.handleResponse(response);
    return result.data;
  }

  async getMyOrders(): Promise<Order[]> {
    const url = `${this.baseUrl}/orders/my-orders`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    const result = await this.handleResponse(response);
    return result.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/orders/${id}`, {
      headers: this.getAuthHeaders(),
    });

    const result = await this.handleResponse(response);
    return result.data;
  }

  async updateOrderStatus(
    id: string,
    status: 'PENDING' | 'PRINTING' | 'DONE' | 'EXPIRED',
  ): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/orders/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const result = await this.handleResponse(response);
    return result.data;
  }

  getFileUrl(fileUrl: string): string {
    return `${this.baseUrl}${fileUrl}`;
  }

  // ============================================
  // Admin Promotions Methods
  // ============================================

  async getAllPromotions(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/admin/promotions`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getPromotionById(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/admin/promotions/${id}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getPromotionStatistics(): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/admin/promotions/statistics`,
      {
        headers: this.getAuthHeaders(),
      },
    );

    return this.handleResponse(response);
  }

  async createPromotion(data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/admin/promotions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async updatePromotion(id: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/admin/promotions/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async deletePromotion(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/admin/promotions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse(response);
  }

  async togglePromotionActive(id: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/admin/promotions/${id}/toggle-active`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      },
    );

    return this.handleResponse(response);
  }

  async renewPromotion(id: string, daysToExtend: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/admin/promotions/${id}/renew`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ daysToExtend }),
      },
    );

    return this.handleResponse(response);
  }

  async resetPromotionUsage(id: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/admin/promotions/${id}/reset-usage`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      },
    );

    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
