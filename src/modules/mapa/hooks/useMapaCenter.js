import { useState, useEffect, useRef } from 'react';
import { comunas } from '../constants/comunas';

const INITIAL_POSITION = [7.886053739251232, -72.497568179007];

export const useMapaCenter = ({
  pacientesPuntos,
  visitas,
  visitasGlobal,
  selectedPacienteId,
  mostrarProfesionales,
  profesionalesFilters,
  mostrarRutasGlobales,
  rutasGlobalesFilters,
  selectedComunas
}) => {
  const [currentCenter, setCurrentCenter] = useState(INITIAL_POSITION);
  const [currentZoom, setCurrentZoom] = useState(13);

  const lastProfesionalId = useRef(null);
  const lastSelectedPacienteId = useRef(null);
  const lastGlobalKey = useRef(null);
  const lastComunaId = useRef(null);

  useEffect(() => {
    // 1. Prioridad: Paciente seleccionado
    const selectedPac = pacientesPuntos.find(p => p.id_paciente === selectedPacienteId);
    if (selectedPac?.latitud && selectedPacienteId !== lastSelectedPacienteId.current) {
      const newCenter = [parseFloat(selectedPac.latitud), parseFloat(selectedPac.longitud)];
      setCurrentCenter(newCenter);
      setCurrentZoom(16);
      lastSelectedPacienteId.current = selectedPacienteId;
      return;
    }

    // 2. Comuna seleccionada
    if (selectedComunas.length > 0) {
      const comunaId = selectedComunas[0];
      if (comunaId !== lastComunaId.current) {
        const info = comunas[comunaId];
        if (info?.coords?.length > 0) {
          // Calcular centro geométrico simple
          const latSum = info.coords.reduce((sum, c) => sum + c[0], 0);
          const lngSum = info.coords.reduce((sum, c) => sum + c[1], 0);
          const newCenter = [latSum / info.coords.length, lngSum / info.coords.length];
          
          setCurrentCenter(newCenter);
          setCurrentZoom(14);
          lastComunaId.current = comunaId;
          return;
        }
      }
    } else {
      lastComunaId.current = null;
    }

    // 3. Profesionales: Solo centrar si cambia el id_profesional o es la primera carga con datos
    if (mostrarProfesionales && visitas.length > 0) {
      const firstVisit = visitas.find(v => v.latitud && v.longitud);
      if (firstVisit && profesionalesFilters.id_profesional !== lastProfesionalId.current) {
        const newCenter = [parseFloat(firstVisit.latitud), parseFloat(firstVisit.longitud)];
        setCurrentCenter(newCenter);
        setCurrentZoom(14);
        lastProfesionalId.current = profesionalesFilters.id_profesional;
      }
    }

    // 4. Rutas Globales
    const globalKey = `${rutasGlobalesFilters.mes}-${rutasGlobalesFilters.anio}`;
    if (mostrarRutasGlobales && visitasGlobal.length > 0 && globalKey !== lastGlobalKey.current) {
       const firstGlobal = visitasGlobal.find(v => v.latitud && v.longitud);
       if (firstGlobal) {
          const newCenter = [parseFloat(firstGlobal.latitud), parseFloat(firstGlobal.longitud)];
          setCurrentCenter(newCenter);
          setCurrentZoom(13);
          lastGlobalKey.current = globalKey;
       }
    }
  }, [
    selectedPacienteId, 
    mostrarProfesionales, 
    profesionalesFilters.id_profesional, 
    visitas, 
    pacientesPuntos,
    mostrarRutasGlobales,
    visitasGlobal,
    rutasGlobalesFilters.mes,
    rutasGlobalesFilters.anio,
    selectedComunas
  ]);

  return { center: currentCenter, zoom: currentZoom, INITIAL_POSITION };
};
