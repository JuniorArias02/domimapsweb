import { useQuery } from '@tanstack/react-query';
import { obtenerOrdenesPorIngreso } from '../services/ordenesMedicasService';

export const QUERY_KEYS_ORDENES = {
  porIngreso: (idIngreso) => ['ordenes-medicas', 'ingreso', idIngreso],
};

/**
 * Hook para obtener las órdenes médicas de un ingreso.
 * @param {number|string} idIngreso 
 */
export const useOrdenesMedicasQuery = (idIngreso) => {
  return useQuery({
    queryKey: QUERY_KEYS_ORDENES.porIngreso(idIngreso),
    queryFn: () => obtenerOrdenesPorIngreso(idIngreso),
    enabled: !!idIngreso,
  });
};
