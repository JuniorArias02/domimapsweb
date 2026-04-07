import { useQuery } from '@tanstack/react-query';
import { obtenerComunasPorZona } from '../services/mapaService';

/**
 * Hook to fetch comunas dependent on a selected zone
 * @param {number|string} id_zona - Selected Zone ID
 */
export const useComunasPorZonaQuery = (id_zona) => {
  return useQuery({
    queryKey: ['comunas', id_zona],
    queryFn: () => obtenerComunasPorZona(id_zona),
    enabled: !!id_zona, // Only fetch if id_zona is provided
    staleTime: 60 * 60 * 1000, // 1 hour cache
  });
};
