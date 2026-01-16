import { useQuery } from '@tanstack/react-query';
import { apiClient, Promotion } from '../api-client';

/**
 * Hook para obtener las promociones activas (públicas)
 */
export function usePromotions() {
  return useQuery<Promotion[], Error>({
    queryKey: ['promotions'],
    queryFn: () => apiClient.getPromotions(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
}

/**
 * Hook para obtener todas las promociones (admin)
 */
export function useAllPromotions() {
  return useQuery<Promotion[], Error>({
    queryKey: ['admin', 'promotions'],
    queryFn: () => apiClient.getAllPromotions(),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}

/**
 * Hook para obtener una promoción por ID (admin)
 */
export function usePromotion(id: string | undefined) {
  return useQuery<Promotion, Error>({
    queryKey: ['admin', 'promotions', id],
    queryFn: () => apiClient.getPromotionById(id!),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}
