import { useQuery } from '@tanstack/react-query';
import { obtenerVisitasProgramadas } from '../services/mapaService';
import { useMapaStore } from '../store/mapaStore';

/**
 * Hook to fetch scheduled visits for route creation
 */
export const useVisitasProgramadasQuery = () => {
  const mostrarCrearRutas = useMapaStore(state => state.mostrarCrearRutas);
  const filters = useMapaStore(state => state.crearRutasFilters);

  const apiParams = {
    mes: filters.mes,
    anio: filters.anio,
  };

  if (filters.id_servicio) {
    apiParams.id_servicio = filters.id_servicio;
  }
  if (filters.id_personal) {
    apiParams.id_personal = filters.id_personal;
  }

  return useQuery({
    queryKey: ['visitas_programadas_crear_rutas', apiParams],
    queryFn: () => obtenerVisitasProgramadas(apiParams),
    enabled: mostrarCrearRutas,
    staleTime: 2 * 60 * 1000,
  });
};
