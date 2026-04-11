import { useQuery } from '@tanstack/react-query';
import { obtenerRutasOptimizadasGlobal } from '../services/mapaService';
import { useMapaStore } from '../store/mapaStore';

/**
 * Hook to fetch globally optimized routes (Patient Route Optimization)
 */
export const useRutasGlobalesQuery = () => {
  const filters = useMapaStore(state => state.rutasGlobalesFilters);
  const mostrarGlobal = useMapaStore(state => state.mostrarRutasGlobales);

  return useQuery({
    queryKey: ['rutas_globales', filters],
    queryFn: () => {
      const params = {
        mes: filters.mes,
        anio: filters.anio,
      };
      
      return obtenerRutasOptimizadasGlobal(params);
    },
    enabled: mostrarGlobal,
    staleTime: 5 * 60 * 1000,
  });
};
