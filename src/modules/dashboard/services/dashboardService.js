import api from '../../../api/api';

export const dashboardService = {
  getDashboardData: async () => {
    const { data } = await api.get('/dashboard');
    return data;
  },
};
