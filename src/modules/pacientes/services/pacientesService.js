import api from '../../../api/api';

const ENDPOINT = '/pacientes';

/**
 * Obtiene la lista de pacientes con filtros opcionales.
 * @param {Object} params - name, identification, page, per_page, etc.
 */
export const obtenerPacientes = async (params = {}) => {
  const { data } = await api.get(ENDPOINT, { params });
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
