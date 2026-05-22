import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registroProgramaService } from '../services/registroProgramaService';

/**
 * Hook para obtener la orden médica de un ingreso específico
 * @param {string|number} ingreso - ID de ingreso
 */
export const useOrdenMedicaQuery = (ingreso) => {
  return useQuery({
    queryKey: ['ordenMedicaIngreso', ingreso],
    queryFn: () => registroProgramaService.obtenerOrdenMedicaIngreso(ingreso),
    enabled: !!ingreso,
    staleTime: 5000,
  });
};

/**
 * Hook de mutación para completar una visita domiciliaria
 * @param {string|number} ingreso - ID de ingreso (para invalidar caché)
 */
export const useCompletarVisitaMutation = (ingreso) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idVisita) => registroProgramaService.completarVisita(idVisita),
    onSuccess: () => {
      // Invalidamos para que la lista de visitas se refresque automáticamente en el modal
      queryClient.invalidateQueries({ queryKey: ['ordenMedicaIngreso', ingreso] });
    }
  });
};
