import { useQuery } from '@tanstack/react-query';
import { obtenerRutas } from '../services/mapaService';
import { useMapaStore } from '../store/mapaStore';

/**
 * Hook to fetch all created routes
 */
export const useRutasQuery = () => {
  const mostrarVerRutas = useMapaStore(state => state.mostrarVerRutas);

  return useQuery({
    queryKey: ['rutas_listado'],
    queryFn: obtenerRutas,
    enabled: mostrarVerRutas,
    staleTime: 1 * 60 * 1000, // 1 minute stale time
  });
};
