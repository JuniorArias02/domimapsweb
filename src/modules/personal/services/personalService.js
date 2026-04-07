import api from '../../../api/api';

export const personalService = {
  getPersonal: async () => {
    const { data } = await api.get('/personal');
    return data;
  },
};
