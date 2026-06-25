import { useMutation, useQueryClient } from '@tanstack/react-query';
import { asignarRuta } from '../services/mapaService';

export const useAsignarRutaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => asignarRuta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutas_listado'] });
      queryClient.invalidateQueries({ queryKey: ['ruta_detalle'] });
    },
  });
};
