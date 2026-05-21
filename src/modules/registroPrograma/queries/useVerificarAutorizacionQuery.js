import { useQuery } from '@tanstack/react-query';
import { registroProgramaService } from '../services/registroProgramaService';

/**
 * Hook para verificar en tiempo real si un código de autorización ya está en uso
 * @param {string} autorizacion - Código de autorización
 */
export const useVerificarAutorizacionQuery = (autorizacion) => {
  return useQuery({
    queryKey: ['verificar-autorizacion', autorizacion],
    queryFn: () => registroProgramaService.verificarAutorizacion(autorizacion),
    enabled: Boolean(autorizacion && autorizacion.trim().length >= 3),
    staleTime: 0,
    retry: false
  });
};
