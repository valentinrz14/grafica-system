import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Promotion } from '@/types/promotion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type { Promotion };

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

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
  token: string;
}

class ApiClient {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor de solicitudes para agregar el token
    this.axios.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Interceptor de respuestas para manejar errores de autenticación
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');

            const currentPath = window.location.pathname;
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
          return Promise.reject(new Error('AUTH_EXPIRED'));
        }

        const message =
          error.response?.data?.message || error.message || 'Request failed';
        return Promise.reject(new Error(message));
      },
    );
  }

  // ============================================
  // Files
  // ============================================
  async uploadFile(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await this.axios.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  }

  // ============================================
  // Orders
  // ============================================
  async calculatePrice(
    files: UploadedFile[],
    options: OrderOptions,
  ): Promise<PriceBreakdown> {
    const { data } = await this.axios.post('/orders/calculate-price', {
      files: files.map((f) => ({ pages: f.pages })),
      options,
    });

    return data.data;
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const { data } = await this.axios.post('/orders', orderData);
    return data.data;
  }

  async getOrders(): Promise<Order[]> {
    const { data } = await this.axios.get('/orders');
    return data.data;
  }

  async getMyOrders(): Promise<Order[]> {
    const { data } = await this.axios.get('/orders/my-orders');
    return data.data;
  }

  async getOrder(id: string): Promise<Order> {
    const { data } = await this.axios.get(`/orders/${id}`);
    return data.data;
  }

  async updateOrderStatus(
    id: string,
    status: 'PENDING' | 'PRINTING' | 'DONE' | 'EXPIRED',
  ): Promise<Order> {
    const { data } = await this.axios.patch(`/orders/${id}/status`, {
      status,
    });
    return data.data;
  }

  getFileUrl(fileUrl: string): string {
    return `${API_URL}${fileUrl}`;
  }

  // ============================================
  // Promotions (Public)
  // ============================================
  async getPromotions(): Promise<Promotion[]> {
    const { data } = await this.axios.get('/promotions');
    return data;
  }

  // ============================================
  // Admin Promotions Methods
  // ============================================
  async getAllPromotions(): Promise<Promotion[]> {
    const { data } = await this.axios.get('/admin/promotions');
    return data;
  }

  async getPromotionById(id: string): Promise<Promotion> {
    const { data } = await this.axios.get(`/admin/promotions/${id}`);
    return data;
  }

  async createPromotion(data: any): Promise<Promotion> {
    const { data: response } = await this.axios.post('/admin/promotions', data);
    return response;
  }

  async updatePromotion(id: string, data: any): Promise<Promotion> {
    const { data: response } = await this.axios.put(
      `/admin/promotions/${id}`,
      data,
    );
    return response;
  }

  async deletePromotion(id: string): Promise<void> {
    await this.axios.delete(`/admin/promotions/${id}`);
  }

  async togglePromotionActive(id: string): Promise<Promotion> {
    const { data } = await this.axios.patch(
      `/admin/promotions/${id}/toggle-active`,
    );
    return data;
  }

  async renewPromotion(id: string, daysToExtend: number): Promise<Promotion> {
    const { data } = await this.axios.patch(`/admin/promotions/${id}/renew`, {
      daysToExtend,
    });
    return data;
  }

  async resetPromotionUsage(id: string): Promise<Promotion> {
    const { data } = await this.axios.patch(
      `/admin/promotions/${id}/reset-usage`,
    );
    return data;
  }

  // ============================================
  // Authentication Methods
  // ============================================
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const { data } = await this.axios.post('/auth/login', credentials);
    return data.data;
  }

  async register(userData: RegisterDto): Promise<void> {
    await this.axios.post('/auth/register', userData);
  }
}

export const apiClient = new ApiClient();
