import { useQuery } from '@tanstack/react-query';
import { useMapaStore } from '../store/mapaStore';
import { obtenerRutasVisitas } from '../services/mapaService';

export const useRutasVisitasQuery = () => {
  const { profesionalesFilters, mostrarProfesionales } = useMapaStore();

  return useQuery({
    queryKey: ['rutasVisitas', profesionalesFilters],
    queryFn: () => obtenerRutasVisitas(profesionalesFilters),
    // Only fetch if layer is active and we have an ID to search
    enabled: mostrarProfesionales && !!profesionalesFilters.id_profesional, 
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};
