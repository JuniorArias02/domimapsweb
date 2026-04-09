import { useQuery } from '@tanstack/react-query';
import { obtenerComunas } from '../services/mapaService';

/**
 * Hook to fetch all comunas without zona restriction
 */
export const useTodoComunasQuery = () => {
  return useQuery({
    queryKey: ['comunas-todas'],
    queryFn: obtenerComunas,
    staleTime: 24 * 60 * 60 * 1000, 
  });
};
