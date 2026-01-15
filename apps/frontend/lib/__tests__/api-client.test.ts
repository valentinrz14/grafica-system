import { apiClient } from '../api-client';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('calculatePrice', () => {
    it('calls the correct endpoint with proper data', async () => {
      const mockResponse = {
        data: {
          basePrice: 100,
          colorSurcharge: 0,
          duplexDiscount: 0,
          totalPrice: 100,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

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

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders/calculate-price'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );

      expect(result).toEqual(mockResponse.data);
    });

    it('throws error when response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error calculating price' }),
      });

      await expect(
        apiClient.calculatePrice(
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
        ),
      ).rejects.toThrow();
    });
  });

  describe('uploadFile', () => {
    it('uploads file with correct form data', async () => {
      const mockResponse = {
        data: {
          id: '123',
          fileName: 'test.pdf',
          originalName: 'test.pdf',
          fileUrl: '/files/test.pdf',
          pages: 10,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });
      const result = await apiClient.uploadFile(file);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/files/upload'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        }),
      );

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('authentication', () => {
    it('includes auth token in headers when present', async () => {
      // Mock localStorage
      const mockToken = 'test-token-123';
      Storage.prototype.getItem = jest.fn(() => mockToken);

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await apiClient.getMyOrders();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        }),
      );
    });
  });
});
