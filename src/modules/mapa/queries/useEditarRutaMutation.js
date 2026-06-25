import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editarRuta } from '../services/mapaService';

export const useEditarRutaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => editarRuta(id, payload),
    onSuccess: () => {
      // Invalidar queries relevantes al actualizar la ruta
      queryClient.invalidateQueries({ queryKey: ['rutas_listado'] });
      queryClient.invalidateQueries({ queryKey: ['visitas_programadas_crear_rutas'] });
      queryClient.invalidateQueries({ queryKey: ['ruta_detalle'] });
    },
  });
};
