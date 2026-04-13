import { useQuery } from '@tanstack/react-query';
import { obtenerRutasOptimizadasGlobal } from '../services/mapaService';
import { useMapaStore } from '../store/mapaStore';

/**
 * Hook to fetch globally optimized routes (Patient Route Optimization)
 */
export const useRutasGlobalesQuery = () => {
  const mostrarGlobal = useMapaStore(state => state.mostrarRutasGlobales);

  return useQuery({
    queryKey: ['rutas_globales'],
    queryFn: obtenerRutasOptimizadasGlobal,
    enabled: mostrarGlobal,
    staleTime: 5 * 60 * 1000,
  });
};
