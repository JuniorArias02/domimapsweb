import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agendamientoService } from '../services/agendamientoService';

/**
 * Hook para obtener el listado de agendas con paginación y filtros
 * @param {Object} params - Filtros y paginación { page, per_page, buscar, estado }
 */
export const useAgendasQuery = (params) => {
  return useQuery({
    queryKey: ['agendas', params],
    queryFn: () => agendamientoService.listarAgendas(params),
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos de cache
  });
};

/**
 * Hook para consultar los servicios según autorización
 */
export const usePendientesPorAutorizacionQuery = (autorizacion) => {
  return useQuery({
    queryKey: ['pendientes-autorizacion', autorizacion],
    queryFn: () => agendamientoService.obtenerPendientesPorAutorizacion(autorizacion),
    enabled: Boolean(autorizacion && autorizacion.length >= 3),
    retry: false
  });
};

/**
 * Hook para programar la visita
 */
export const useProgramarVisitaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => agendamientoService.programarVisita(data),
    onSuccess: () => {
      // Invalidar query de agendas y otros relacionados
      queryClient.invalidateQueries(['agendas']);
      queryClient.invalidateQueries(['pendientes-autorizacion']);
    }
  });
};

/**
 * Hook para obtener el historial de tratamientos de un paciente para continuidad
 */
export const useHistorialTratamientosQuery = (idPaciente, idServicio = null) => {
  return useQuery({
    queryKey: ['historial-tratamientos', idPaciente, idServicio],
    queryFn: () => agendamientoService.obtenerHistorialPaciente(idPaciente, idServicio),
    enabled: Boolean(idPaciente && idServicio),
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};

/**
 * Hook para buscar continuidades avanzadas
 */
export const useBuscarContinuidadAvanzadaMutation = () => {
  return useMutation({
    mutationFn: (filtros) => agendamientoService.buscarContinuidadAvanzada(filtros)
  });
};
