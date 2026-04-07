import api from '../../../api/api';

/**
 * Fetch pacientes for map visualization with pagination and filtering
 * @param {Object} params - Query params (id_zona, id_comuna, id_aseguradora, estado, per_page, page)
 * @returns {Promise} Resolves to paginated response
 */
export const obtenerPacientesMapa = async (params = {}) => {
  const response = await api.get('/mapas/pacientes/puntos', { params });
  return response.data;
};

/**
 * Fetch detailed patient data for the map sidebar
 * @param {number|string} id - Patient ID
 * @returns {Promise} Resolves to detailed response
 */
export const obtenerDetallePacienteMapa = async (id) => {
  const response = await api.get(`/mapas/pacientes/detalle/${id}`);
  return response.data;
};

/**
 * Fetch all zones for filtering
 * @returns {Promise} Resolves to list of zones
 */
export const obtenerZonas = async () => {
  const response = await api.get('/zonas');
  return response.data;
};

/**
 * Fetch comunas by zona for cascading filters
 * @param {number|string} id_zona - Zone ID
 * @returns {Promise} Resolves to list of comunas
 */
export const obtenerComunasPorZona = async (id_zona) => {
  const response = await api.get(`/comunas/zona/${id_zona}`);
  return response.data;
};

/**
 * Fetch all health insurers (aseguradoras)
 * @returns {Promise} Resolves to list of insurers
 */
export const obtenerAseguradoras = async () => {
  const response = await api.get('/aseguradoras');
  return response.data;
};

/**
 * Fetch routes of visits for a professional
 * @param {Object} params - Query params (fecha_inicio, fecha_fin, id_profesional, page, per_page)
 * @returns {Promise} Resolves to paginated response
 */
export const obtenerRutasVisitas = async (params = {}) => {
  const response = await api.get('/mapas/rutas-visitas', { params });
  return response.data;
};
