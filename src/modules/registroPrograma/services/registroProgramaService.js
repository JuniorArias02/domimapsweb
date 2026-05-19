import api from '../../../api/api';

/**
 * Servicio para consumir endpoints del módulo de Registro de Programa
 */
export const registroProgramaService = {
  /**
   * Obtener listado de pacientes registrados en el programa
   * @param {Object} params - Parámetros de búsqueda (pagina, por_pagina, nombre_completo, identificacion, ingreso, autorizacion)
   * @returns {Promise<Object>} Datos de pacientes y meta
   */
  listarPacientes: async (params = {}) => {
    const response = await api.get('registro-programa/pacientes', { params });
    return response.data;
  },

  /**
   * Obtener autorizaciones de un paciente específico por su ID
   * @param {number|string} idPaciente - ID del paciente
   * @returns {Promise<Object>} Listado de autorizaciones del paciente
   */
  obtenerAutorizacionesPaciente: async (idPaciente) => {
    const response = await api.get(`registro-programa/pacientes/${idPaciente}/autorizaciones`);
    return response.data;
  },

  /**
   * Obtener orden médica de un ingreso específico
   * @param {string|number} ingreso - ID de ingreso
   * @returns {Promise<Object>} Orden médica con sus servicios y visitas
   */
  obtenerOrdenMedicaIngreso: async (ingreso) => {
    const response = await api.get(`registro-programa/ingreso/${ingreso}/orden-medica`);
    return response.data;
  }
};
