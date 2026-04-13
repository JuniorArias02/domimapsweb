import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { obtenerListadoAgendas } from '../services/agendaService';
import { AgendaFilters } from '../types/agenda';

/**
 * Capa de Aplicación (Application)
 * Hook para gestionar el listado de agendas con filtros y paginación.
 */
export const useAgendas = () => {
  const [filters, setFilters] = useState<AgendaFilters>({
    page: 1,
    per_page: 15,
    buscar: '',
    estado: ''
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.buscar);

  // Implementación de debounce para la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.buscar);
      setFilters(prev => ({ ...prev, page: 1 })); // Reset a página 1 al buscar
    }, 500);

    return () => clearTimeout(handler);
  }, [filters.buscar]);

  const queryFilters = { ...filters, buscar: debouncedSearch };

  const query = useQuery({
    queryKey: ['agendas', queryFilters],
    queryFn: () => obtenerListadoAgendas(queryFilters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const changePage = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const changePerPage = (newPerPage: number) => {
    setFilters(prev => ({ ...prev, per_page: newPerPage, page: 1 }));
  };

  const updateFilter = (newFilters: Partial<AgendaFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  return {
    ...query,
    filters,
    setFilters: updateFilter,
    changePage,
    changePerPage
  };
};
