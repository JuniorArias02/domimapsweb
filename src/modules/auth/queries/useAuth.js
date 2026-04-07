import { useMutation, useQuery } from '@tanstack/react-query';
import authService from '../services/authService';
import useAuthStore from '../../../store/authStore';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // API returns { success, token, token_type, expires_in, usuario }
      const { token, usuario } = data;
      setAuth(usuario, token);
    },
    onError: (error) => {
      console.error('Error logging in:', error);
    }
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem('token'),
  });
};
