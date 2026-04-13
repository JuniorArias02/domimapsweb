import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { personalService } from '../../personal/services/personalService';

/**
 * Hook para buscar personal médico/administrativo para selectores.
 */
export const usePersonalBusqueda = (termino: string) => {
  const [debouncedTerm, setDebouncedTerm] = useState(termino);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(termino);
    }, 400);
    return () => clearTimeout(handler);
  }, [termino]);

  return useQuery({
    queryKey: ['personal-busqueda', debouncedTerm],
    queryFn: () => personalService.buscarPersonal(debouncedTerm),
    enabled: debouncedTerm.length >= 2,
    staleTime: 60 * 1000,
  });
};
