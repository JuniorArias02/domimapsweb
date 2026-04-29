import api from '../../../api/api';

const ENDPOINT = '/ordenes-medicas';

/**
 * Obtiene las órdenes médicas asociadas a un ingreso específico.
 * @param {number|string} idIngreso 
 */
export const obtenerOrdenesPorIngreso = async (idIngreso) => {
  const { data } = await api.get(`${ENDPOINT}/ingreso/${idIngreso}`);
  return data;
};
