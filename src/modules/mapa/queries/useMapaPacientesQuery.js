import { useQuery } from '@tanstack/react-query';
import { obtenerPacientesMapaTodos } from '../services/mapaService';
import { useMapaStore } from '../store/mapaStore';

export const useMapaPacientesQuery = () => {
  const pacientesFilters = useMapaStore(state => state.pacientesFilters);
  const mostrarPacientes = useMapaStore(state => state.mostrarPacientes);

  return useQuery({
    queryKey: ['mapa_pacientes_puntos', pacientesFilters],
    queryFn: () => {
      // Clean up empty params (exclude pagination params since we now fetch all)
      const { page, per_page, ...restFilters } = pacientesFilters;
      const params = Object.fromEntries(
        Object.entries(restFilters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
      return obtenerPacientesMapaTodos(params);
    },
    // Only fetch if we are actually showing patients
    enabled: mostrarPacientes,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
