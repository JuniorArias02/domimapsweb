import { useQuery } from '@tanstack/react-query';
import { personalService } from '../services/personalService';

export const usePersonalQuery = () => {
  return useQuery({
    queryKey: ['personal'],
    queryFn: personalService.getPersonal,
  });
};
