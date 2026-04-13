import api from '../../../api/api';

export const personalService = {
  getPersonal: async () => {
    const { data } = await api.get('/personal');
    return data;
  },

  buscarPersonal: async (q) => {
    const { data } = await api.get('/personal/buscar', { params: { q, limit: 5 } });
    return data;
  }
};
