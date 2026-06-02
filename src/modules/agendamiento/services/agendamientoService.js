import api from '../../../api/api';

/**
 * Servicio para consumir endpoints del módulo de Agendamiento
 */

export const agendamientoService = {
  /**
   * Buscar ingresos activos
   * @param {string} q - Cadena de búsqueda
   * @returns {Promise<Array>} Lista de ingresos
   */
  buscarIngresos: async (q) => {
    if (!q) return [];
    const response = await api.get('ingresos/buscar', { params: { q } });
    return response.data?.data || [];
  },

  /**
   * Buscar servicios médicos
   * @param {string} q - Cadena de búsqueda
   * @returns {Promise<Array>} Lista de servicios
   */
  buscarServicios: async (q) => {
    if (!q) return [];
    const response = await api.get('servicios/buscar', { params: { q } });
    return response.data?.data || [];
  },

  /**
   * Buscar personal médico/administrativo
   * @param {string} q - Cadena de búsqueda
   * @returns {Promise<Array>} Lista de personal
   */
  buscarPersonal: async (q) => {
    if (!q) return [];
    const response = await api.get('personal/buscar', { params: { q } });
    return response.data?.data || [];
  },

  /**
   * Obtener listado detallado de agendas
   * @param {Object} params - Parámetros de búsqueda (page, per_page, buscar, estado)
   * @returns {Promise<Object>} Datos de agendas y meta
   */
  listarAgendas: async (params = {}) => {
    const response = await api.get('agenda/listado-detallado', { params });
    return response.data;
  },

  /**
   * Consultar los servicios pendientes según la Autorización
   */
  obtenerPendientesPorAutorizacion: async (autorizacion) => {
    if (!autorizacion) return [];
    const response = await api.get('ordenes-servicio/pendientes-por-autorizacion', { params: { autorizacion } });
    return response.data?.data || [];
  },

  /**
   * Programar la visita domiciliaria validando sesiones
   */
  programarVisita: async (data) => {
    const response = await api.post('visitas-domiciliarias/por-orden-servicio', data);
    return response.data;
  }
};
