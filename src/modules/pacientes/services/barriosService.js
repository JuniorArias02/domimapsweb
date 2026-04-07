import api from '../../../api/api';

/**
 * Obtiene la lista de barrios.
 */
export const obtenerBarrios = async () => {
  const { data } = await api.get('/barrios');
  return data;
};
