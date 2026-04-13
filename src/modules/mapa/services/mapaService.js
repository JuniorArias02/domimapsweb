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
 * Fetch ALL patients for map visualization without pagination
 * @param {Object} params - Query params (id_zona, id_comuna, id_aseguradora, estado)
 * @returns {Promise} Resolves to list of patients
 */
export const obtenerPacientesMapaTodos = async (params = {}) => {
  const response = await api.get('/mapas/pacientes/puntos/todos', { params });
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

/**
 * Fetch all comunas for global filtering
 * @returns {Promise} Resolves to list of comunas
 */
export const obtenerComunas = async () => {
  const response = await api.get('/comunas');
  return response.data;
};


/**
 * Fetch patients belonging to a specific comuna
 * @param {number|string} id_comuna - Comuna ID
 * @returns {Promise} Resolves to list of patients
 */
export const obtenerPacientesPorComuna = async (id_comuna) => {
  const response = await api.get(`/mapas/comunas/${id_comuna}/pacientes`);
  return response.data;
};



/**
 * Fetch global optimized routes (Patient Route Optimization)
 * No longer requires parameters as it returns the full mega-list
 */
export const obtenerRutasOptimizadasGlobal = async () => {
  const response = await api.get('/mapas/rutas-optimizadas');
  return response.data;
};