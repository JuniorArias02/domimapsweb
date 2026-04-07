import api from '../../../api/api';

const ENDPOINT = '/pacientes';

/**
 * Obtiene la lista de todos los pacientes.
 * @param {number} pagina
 */
export const obtenerPacientes = async (pagina = 1) => {
  const { data } = await api.get(`${ENDPOINT}?page=${pagina}`);
  return data;
};

/**
 * Obtiene un paciente por su ID.
 * @param {number|string} id
 */
export const obtenerPacientePorId = async (id) => {
  const { data } = await api.get(`${ENDPOINT}/${id}`);
  return data;
};

/**
 * Crea un nuevo paciente.
 * @param {Object} paciente
 */
export const crearPaciente = async (paciente) => {
  const { data } = await api.post(ENDPOINT, paciente);
  return data;
};

/**
 * Actualiza un paciente existente.
 * @param {number|string} id
 * @param {Object} paciente
 */
export const actualizarPaciente = async (id, paciente) => {
  const { data } = await api.put(`${ENDPOINT}/${id}`, paciente);
  return data;
};

/**
 * Elimina un paciente por su ID.
 * @param {number|string} id
 */
export const eliminarPaciente = async (id) => {
  const { data } = await api.delete(`${ENDPOINT}/${id}`);
  return data;
};
