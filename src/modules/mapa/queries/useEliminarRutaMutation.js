import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eliminarRuta } from '../services/mapaService';

export const useEliminarRutaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => eliminarRuta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutas_listado'] });
      queryClient.invalidateQueries({ queryKey: ['visitas_programadas_crear_rutas'] });
    },
  });
};
