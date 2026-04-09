import { useQuery } from '@tanstack/react-query';
import { obtenerPacientesPorComuna } from '../services/mapaService';

/**
 * Hook to fetch patients filtered by a specific comuna
 * @param {number|string} id_comuna - Selected comuna ID
 */
export const usePacientesComunaQuery = (id_comuna) => {
  return useQuery({
    queryKey: ['pacientes-comuna', id_comuna],
    queryFn: () => obtenerPacientesPorComuna(id_comuna),
    enabled: !!id_comuna, // Only fetch if an ID is provided
  });
};
