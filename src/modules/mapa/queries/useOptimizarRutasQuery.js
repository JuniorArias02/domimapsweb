import { useQuery } from '@tanstack/react-query';
import { optimizarRutas } from '../services/mapaService';
import { useMapaStore } from '../store/mapaStore';

/**
 * Hook to fetch projected optimized routes based on frequency and proximity
 */
export const useOptimizarRutasQuery = () => {
  const mostrarOptimizador = useMapaStore(state => state.mostrarOptimizador);
  const filters = useMapaStore(state => state.optimizadorFilters);

  // We only send mes, anio, and tipo_filtro to the API
  const apiParams = {
    mes: filters.mes,
    anio: filters.anio,
    tipo_filtro: filters.tipo_filtro
  };

  return useQuery({
    queryKey: ['rutas_optimizadas_proyectadas', apiParams],
    queryFn: () => optimizarRutas(apiParams),
    enabled: mostrarOptimizador,
    staleTime: 5 * 60 * 1000,
  });
};
