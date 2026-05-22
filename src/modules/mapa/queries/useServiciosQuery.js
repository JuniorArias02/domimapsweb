import { useQuery } from '@tanstack/react-query';
import { obtenerServicios } from '../services/mapaService';

/**
 * Hook to fetch all medical services
 */
export const useServiciosQuery = () => {
  return useQuery({
    queryKey: ['servicios_mapa'],
    queryFn: obtenerServicios,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours cache for services
  });
};
