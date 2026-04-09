import { useQuery } from '@tanstack/react-query';
import { obtenerRutasOptimizadas } from '../services/mapaService';
import { useMapaStore } from '../store/mapaStore';

/**
 * Hook to fetch optimized routes for a professional
 */
export const useRutasOptimizadasQuery = () => {
  const routesFilters = useMapaStore(state => state.rutasOptimizadasFilters);
  const mostrarRutas = useMapaStore(state => state.mostrarRutasOptimizadas);

  return useQuery({
    queryKey: ['rutas_optimizadas', routesFilters],
    queryFn: () => {
      // Basic validation: need a professional to fetch routes
      if (!routesFilters.id_personal) return { data: [] };
      
      const params = {
        mes: routesFilters.mes,
        anio: routesFilters.anio,
        id_personal: routesFilters.id_personal
      };
      
      return obtenerRutasOptimizadas(params);
    },
    enabled: mostrarRutas && !!routesFilters.id_personal,
    staleTime: 5 * 60 * 1000,
  });
};
