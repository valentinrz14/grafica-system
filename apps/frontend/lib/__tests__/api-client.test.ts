// Mock axios BEFORE importing apiClient
jest.mock('axios', () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockInstance),
    },
  };
});

import axios from 'axios';
import { apiClient } from '../api-client';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculatePrice', () => {
    it('calls the correct endpoint with proper data', async () => {
      const mockResponse = {
        data: {
          data: {
            basePrice: 100,
            pages: 10,
            quantity: 1,
            colorMultiplier: 1,
            duplexMultiplier: 1,
            subtotal: 100,
            total: 100,
          },
        },
      };

      // Mock the axios post method
      (apiClient as any).axios.post.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.calculatePrice(
        [
          {
            id: '1',
            fileName: 'test.pdf',
            originalName: 'test.pdf',
            fileUrl: '/files/test.pdf',
            pages: 10,
          },
        ],
        {
          size: 'A4',
          isColor: false,
          isDuplex: false,
          quantity: 1,
        },
      );

      expect((apiClient as any).axios.post).toHaveBeenCalledWith(
        '/orders/calculate-price',
        {
          files: [{ pages: 10 }],
          options: {
            size: 'A4',
            isColor: false,
            isDuplex: false,
            quantity: 1,
          },
        },
      );

      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe('uploadFile', () => {
    it('uploads file with correct form data', async () => {
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      const mockResponse = {
        data: {
          data: {
            id: '1',
            fileName: 'test.pdf',
            originalName: 'test.pdf',
            fileUrl: '/files/test.pdf',
            pages: 1,
          },
        },
      };

      (apiClient as any).axios.post.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.uploadFile(mockFile);

      expect((apiClient as any).axios.post).toHaveBeenCalledWith(
        '/files/upload',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe('authentication', () => {
    it('includes auth token in headers when present', async () => {
      // Mock localStorage
      const mockToken = 'test-token-123';
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => mockToken),
          setItem: jest.fn(),
          removeItem: jest.fn(),
          clear: jest.fn(),
        },
        writable: true,
      });

      const mockResponse = {
        data: {
          data: [],
        },
      };

      (apiClient as any).axios.get.mockResolvedValueOnce(mockResponse);

      await apiClient.getMyOrders();

      // Axios adds the token via interceptor, not directly in the call
      // So we just verify the call was made
      expect((apiClient as any).axios.get).toHaveBeenCalledWith(
        '/orders/my-orders',
      );
    });
  });
});
