import { useQuery } from '@tanstack/react-query';
import { obtenerZonas } from '../services/mapaService';

/**
 * Hook to fetch all geographic zones
 */
export const useZonasQuery = () => {
  return useQuery({
    queryKey: ['zonas'],
    queryFn: obtenerZonas,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours cache for zones
  });
};
