import { useQuery } from '@tanstack/react-query';
import { personalService } from '../services/personalService';

export const usePersonalQuery = () => {
  return useQuery({
    queryKey: ['personal'],
    queryFn: personalService.getPersonal,
  });
};

export const useBuscarPersonal = (q) => {
  return useQuery({
    queryKey: ['personal-buscar', q],
    queryFn: async () => {
      const res = await personalService.buscarPersonal(q);
      return res?.data || res || [];
    },
    enabled: Boolean(q && q.trim().length >= 2),
    staleTime: 1000 * 60 * 5,
  });
};

