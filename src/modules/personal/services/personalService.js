import api from '../../../api/api';

export const personalService = {
  getPersonal: async () => {
    const { data } = await api.get('/personal');
    return data;
  },

  buscarPersonal: async (q) => {
    const { data } = await api.get('/personal/buscar', { params: { q, limit: 5 } });
    return data;
  },

  getEstadisticas: async (id_personal) => {
    const { data } = await api.get(`/personal/${id_personal}/estadisticas`);
    return data;
  },

  getIngresos: async (id_personal) => {
    const { data } = await api.get(`/personal/${id_personal}/ingresos`);
    return data;
  }
};
