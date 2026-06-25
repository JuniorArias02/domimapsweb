import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearRuta } from '../services/mapaService';

/**
 * Hook to create a new route in the database and refresh scheduled visits
 */
export const useCrearRutaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => crearRuta(payload),
    onSuccess: () => {
      // Invalidate the query for scheduled visits so it updates dynamically
      queryClient.invalidateQueries({ queryKey: ['visitas_programadas_crear_rutas'] });
      queryClient.invalidateQueries({ queryKey: ['rutas_listado'] });
    },
  });
};
