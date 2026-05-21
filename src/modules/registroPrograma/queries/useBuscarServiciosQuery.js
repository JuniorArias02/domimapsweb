import { useQuery } from '@tanstack/react-query';
import { registroProgramaService } from '../services/registroProgramaService';

/**
 * Hook para buscar servicios médicos dinámicamente
 * @param {string} q - Cadena de búsqueda (nombre o código de servicio)
 */
export const useBuscarServiciosQuery = (q) => {
  return useQuery({
    queryKey: ['servicios-buscar', q],
    queryFn: () => registroProgramaService.buscarServicios(q),
    enabled: Boolean(q && q.trim().length >= 2),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
