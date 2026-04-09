import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useMapaStore } from '../store/mapaStore';
import { obtenerRutasVisitas } from '../services/mapaService';

export const useRutasVisitasQuery = () => {
  const { profesionalesFilters, mostrarProfesionales } = useMapaStore();

  return useQuery({
    queryKey: ['rutasVisitas', profesionalesFilters],
    queryFn: () => {
      // Limpiar parámetros vacíos pero asegurar que los necesarios se envíen
      const params = Object.fromEntries(
        Object.entries(profesionalesFilters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
      
      console.log('Fetching rutas with params:', params);
      return obtenerRutasVisitas(params);
    },
    // Solo fetching si la capa está activa y hay un profesional seleccionado
    enabled: mostrarProfesionales && !!profesionalesFilters.id_profesional, 
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
