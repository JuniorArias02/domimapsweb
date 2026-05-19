import { useQuery } from '@tanstack/react-query';
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
