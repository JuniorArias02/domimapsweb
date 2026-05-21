import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registroProgramaService } from '../services/registroProgramaService';
import { crearAutorizacion } from '../../pacientes/services/autorizacionesService';

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

/**
 * Hook para crear una autorización en registro de programa
 * @param {number|string} idPaciente - ID del paciente
 */
export const useCrearAutorizacionPacienteMutation = (idPaciente) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos) => crearAutorizacion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autorizacionesPaciente', idPaciente] });
    },
  });
};
