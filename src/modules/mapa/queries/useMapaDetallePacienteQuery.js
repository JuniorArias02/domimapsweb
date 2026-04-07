import { useQuery } from '@tanstack/react-query';
import { obtenerDetallePacienteMapa } from '../services/mapaService';

/**
 * Hook to fetch deep patient details including last visit and diagnostics
 * for the map sidebar.
 */
export const useMapaDetallePacienteQuery = (id) => {
  return useQuery({
    queryKey: ['mapa_paciente_detalle', id],
    queryFn: () => obtenerDetallePacienteMapa(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
