import { useMutation } from '@tanstack/react-query';
import { crearAgenda } from '../services/agendaService';
import { AgendaPayload } from '../types/agendaPayload';

/**
 * Capa de Aplicación (Application)
 * Hook orquestador para la interacción con la API.
 */
export const useCrearAgenda = () => {
  return useMutation({
    mutationFn: (payload: AgendaPayload) => crearAgenda(payload),
  });
};
