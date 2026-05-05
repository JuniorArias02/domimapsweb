import { useQuery } from '@tanstack/react-query';
import { agendamientoService } from '../services/agendamientoService';

/**
 * Hook para buscar ingresos dinámicamente
 */
export const useIngresosBusqueda = (query) => {
  return useQuery({
    queryKey: ['busqueda-ingresos', query],
    queryFn: () => agendamientoService.buscarIngresos(query),
    enabled: Boolean(query && query.length >= 2),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para buscar servicios dinámicamente
 */
export const useServiciosBusqueda = (query) => {
  return useQuery({
    queryKey: ['busqueda-servicios', query],
    queryFn: () => agendamientoService.buscarServicios(query),
    enabled: Boolean(query && query.length >= 2),
    staleTime: 1000 * 60 * 60, // 1 hora de caché (los servicios cambian poco)
  });
};

/**
 * Hook para buscar personal dinámicamente
 */
export const usePersonalBusqueda = (query) => {
  return useQuery({
    queryKey: ['busqueda-personal', query],
    queryFn: () => agendamientoService.buscarPersonal(query),
    enabled: Boolean(query && query.length >= 2),
    staleTime: 1000 * 60 * 5,
  });
};
