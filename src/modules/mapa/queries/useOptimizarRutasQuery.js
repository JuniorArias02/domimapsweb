import { useQuery } from '@tanstack/react-query';
import { optimizarRutas } from '../services/mapaService';
import { useMapaStore } from '../store/mapaStore';

/**
 * Hook to fetch projected optimized routes based on frequency and proximity
 */
export const useOptimizarRutasQuery = () => {
  const mostrarOptimizador = useMapaStore(state => state.mostrarOptimizador);
  const filters = useMapaStore(state => state.optimizadorFilters);

  // We send mes, anio, tipo_filtro, ver_agendados, and id_servicio to the API
  const apiParams = {
    mes: filters.mes,
    anio: filters.anio,
    tipo_filtro: filters.tipo_filtro,
    ver_agendados: filters.ver_agendados,
    id_servicio: filters.id_servicio
  };

  return useQuery({
    queryKey: ['rutas_optimizadas_proyectadas', apiParams],
    queryFn: () => optimizarRutas(apiParams),
    enabled: mostrarOptimizador,
    staleTime: 5 * 60 * 1000,
  });
};
