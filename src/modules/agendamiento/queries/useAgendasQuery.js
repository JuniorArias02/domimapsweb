import { useQuery } from '@tanstack/react-query';
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
