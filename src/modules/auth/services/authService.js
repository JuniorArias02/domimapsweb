import api from '../../../api/api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    // backend logout if needed
    // await api.post('/auth/logout');
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  }
};

export default authService;
