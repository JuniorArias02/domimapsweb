import api from '../../../api/api';

const ENDPOINT = '/ingresos';

/**
 * Obtiene las autorizaciones de un paciente específico.
 * @param {number|string} idPaciente 
 */
export const obtenerAutorizacionesPorPaciente = async (idPaciente) => {
  const { data } = await api.get(`${ENDPOINT}/paciente/${idPaciente}/autorizaciones`);
  return data;
};

/**
 * Crea una nueva autorización.
 * @param {Object} autorizacion 
 */
export const crearAutorizacion = async (autorizacion) => {
  // Ajustar el endpoint según sea necesario para crear
  const { data } = await api.post(`${ENDPOINT}/autorizaciones`, autorizacion);
  return data;
};

/**
 * Actualiza una autorización existente.
 * @param {number|string} id 
 * @param {Object} autorizacion 
 */
export const actualizarAutorizacion = async (id, autorizacion) => {
  const { data } = await api.put(`${ENDPOINT}/autorizaciones/${id}`, autorizacion);
  return data;
};

/**
 * Elimina una autorización.
 * @param {number|string} id 
 */
export const eliminarAutorizacion = async (id) => {
  const { data } = await api.delete(`${ENDPOINT}/autorizaciones/${id}`);
  return data;
};
