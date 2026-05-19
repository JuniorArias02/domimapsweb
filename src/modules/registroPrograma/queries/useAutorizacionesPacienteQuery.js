import { useQuery } from '@tanstack/react-query';
import { registroProgramaService } from '../services/registroProgramaService';

/**
 * Hook para obtener las autorizaciones de un paciente registrado en el programa
 * @param {number|string} idPaciente - ID del paciente
 */
export const useAutorizacionesPacienteQuery = (idPaciente) => {
  return useQuery({
    queryKey: ['autorizacionesPaciente', idPaciente],
    queryFn: () => registroProgramaService.obtenerAutorizacionesPaciente(idPaciente),
    enabled: !!idPaciente,
    staleTime: 5000,
  });
};
