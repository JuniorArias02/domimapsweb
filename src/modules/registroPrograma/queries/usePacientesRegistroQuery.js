import { useQuery } from '@tanstack/react-query';
import { registroProgramaService } from '../services/registroProgramaService';

/**
 * Hook para obtener el listado de pacientes registrados en el programa con paginación y filtros
 * @param {Object} params - Filtros y paginación { pagina, por_pagina, nombre_completo, identificacion, ingreso, autorizacion }
 */
export const usePacientesRegistroQuery = (params) => {
  return useQuery({
    queryKey: ['pacientesRegistro', params],
    queryFn: () => registroProgramaService.listarPacientes(params),
    keepPreviousData: true,
    staleTime: 5000,
  });
};
