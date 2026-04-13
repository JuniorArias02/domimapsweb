import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { obtenerPacientes } from '../../pacientes/services/pacientesService';

/**
 * Hook para buscar pacientes de forma dinámica para selectores/autocompletados.
 */
export const usePacientesBusqueda = (termino: string) => {
  const [debouncedTerm, setDebouncedTerm] = useState(termino);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(termino);
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [termino]);

  return useQuery({
    queryKey: ['pacientes-busqueda', debouncedTerm],
    queryFn: () => obtenerPacientes({
      nombre: debouncedTerm,
      por_pagina: 5 // Solo queremos los primeros 5 resultados
    }),
    enabled: debouncedTerm.length >= 2, // Solo buscar si hay al menos 2 caracteres
    staleTime: 60 * 1000,
  });
};
