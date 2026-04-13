import api from '../../../api/api';
import { AgendaPayload } from '../types/agendaPayload';
import { AgendaResponse, AgendaFilters } from '../types/agenda';

/**
 * Capa de Infraestructura (Infrastructure)
 * Servicio para conectarse al backend y gestionar agendas.
 */
export const crearAgenda = async (payload: AgendaPayload) => {
  const response = await api.post('/agenda/crear', payload);
  return response.data;
};

export const obtenerListadoAgendas = async (filters: AgendaFilters): Promise<AgendaResponse> => {
  const response = await api.get('/agenda/listado', { params: filters });
  return response.data;
};
