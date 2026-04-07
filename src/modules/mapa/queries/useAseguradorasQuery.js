import { useQuery } from '@tanstack/react-query';
import { obtenerAseguradoras } from '../services/mapaService';

/**
 * Hook to fetch all available health insurers (aseguradoras)
 */
export const useAseguradorasQuery = () => {
  return useQuery({
    queryKey: ['aseguradoras'],
    queryFn: obtenerAseguradoras,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours cache for insurers
  });
};
