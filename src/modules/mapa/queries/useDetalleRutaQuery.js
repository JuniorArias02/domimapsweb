import { useQuery } from '@tanstack/react-query';
import { obtenerDetalleRuta } from '../services/mapaService';

/**
 * Hook to fetch detailed data of a single route
 * @param {number|string} id - Route ID
 */
export const useDetalleRutaQuery = (id) => {
  return useQuery({
    queryKey: ['ruta_detalle', id],
    queryFn: () => obtenerDetalleRuta(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });
};
