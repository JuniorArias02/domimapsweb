import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  obtenerAutorizacionesPorPaciente,
  crearAutorizacion,
  actualizarAutorizacion,
  eliminarAutorizacion
} from '../services/autorizacionesService';

export const QUERY_KEYS_AUTORIZACIONES = {
  all: ['autorizaciones'],
  porPaciente: (idPaciente) => ['autorizaciones', 'paciente', idPaciente],
};

/**
 * Hook para obtener las autorizaciones de un paciente.
 * @param {number|string} idPaciente 
 */
export const useAutorizacionesQuery = (idPaciente) => {
  return useQuery({
    queryKey: QUERY_KEYS_AUTORIZACIONES.porPaciente(idPaciente),
    queryFn: () => obtenerAutorizacionesPorPaciente(idPaciente),
    enabled: !!idPaciente,
  });
};

/**
 * Mutación para crear una autorización.
 */
export const useCrearAutorizacionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearAutorizacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_AUTORIZACIONES.all });
    },
  });
};

/**
 * Mutación para actualizar una autorización.
 */
export const useActualizarAutorizacionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }) => actualizarAutorizacion(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_AUTORIZACIONES.all });
    },
  });
};

/**
 * Mutación para eliminar una autorización.
 */
export const useEliminarAutorizacionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarAutorizacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_AUTORIZACIONES.all });
    },
  });
};
