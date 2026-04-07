import api from '../../../api/api';

/**
 * Obtiene la lista de aseguradoras activas.
 */
export const obtenerAseguradoras = async () => {
  const { data } = await api.get('/aseguradoras');
  return data;
};
