import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
