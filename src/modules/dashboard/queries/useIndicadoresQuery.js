import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useIndicadoresQuery = () => {
  return useQuery({
    queryKey: ['dashboard_indicadores'],
    queryFn: dashboardService.getIndicadoresData,
    refetchInterval: 1000 * 60 * 5, // Refrescar cada 5 minutos
  });
};
