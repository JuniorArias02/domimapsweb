import { useState, useEffect, useRef } from 'react';
import { comunas } from '../constants/comunas';
import { useMapaStore } from '../store/mapaStore';

const INITIAL_POSITION = [7.886053739251232, -72.497568179007];

export const useMapaCenter = ({
  pacientesPuntos = [],
  visitas = [],
  visitasGlobal = [],
  selectedPacienteId,
  mostrarProfesionales,
  profesionalesFilters = {},
  mostrarRutasGlobales,
  rutasGlobalesFilters = {},
  selectedComunas = [],
  mostrarCrearRutas,
  visitasProgramadas = [],
  crearRutasFilters = {},
  mostrarVerRutas,
  selectedRutaId,
  routeVisitas = []
}) => {
  const [currentCenter, setCurrentCenter] = useState(INITIAL_POSITION);
  const [currentZoom, setCurrentZoom] = useState(13);

  const lastProfesionalId = useRef(null);
  const lastSelectedPacienteId = useRef(null);
  const lastGlobalKey = useRef(null);
  const lastComunaId = useRef(null);
  const lastPersonalId = useRef(null);
  const lastServicioId = useRef(null);
  const lastRutaId = useRef(null);
  
  const { selectedPacienteInfo } = useMapaStore();

  useEffect(() => {
    // 1. Prioridad: Paciente seleccionado
    // Si tenemos la info directamente (ej: desde el buscador), usarla. Si no, buscar en los puntos cargados.
    const selectedPac = selectedPacienteInfo || pacientesPuntos.find(p => p.id_paciente === selectedPacienteId);
    if (selectedPac?.latitud && selectedPacienteId !== lastSelectedPacienteId.current) {
      const newCenter = [parseFloat(selectedPac.latitud), parseFloat(selectedPac.longitud)];
      setCurrentCenter(newCenter);
      setCurrentZoom(16);
      lastSelectedPacienteId.current = selectedPacienteId;
      return;
    }

    // 1.5. Prioridad: Ruta seleccionada
    if (mostrarVerRutas && selectedRutaId && routeVisitas.length > 0 && selectedRutaId !== lastRutaId.current) {
      const firstVisit = routeVisitas.find(v => v.paciente?.latitud && v.paciente?.longitud);
      if (firstVisit) {
        const newCenter = [parseFloat(firstVisit.paciente.latitud), parseFloat(firstVisit.paciente.longitud)];
        setCurrentCenter(newCenter);
        setCurrentZoom(14);
        lastRutaId.current = selectedRutaId;
        return;
      }
    } else if (!selectedRutaId) {
      lastRutaId.current = null;
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
      if (firstVisit && profesionalesFilters?.id_profesional !== lastProfesionalId.current) {
        const newCenter = [parseFloat(firstVisit.latitud), parseFloat(firstVisit.longitud)];
        setCurrentCenter(newCenter);
        setCurrentZoom(14);
        lastProfesionalId.current = profesionalesFilters?.id_profesional;
      }
    }

    // 4. Rutas Globales
    if (mostrarRutasGlobales && visitasGlobal.length > 0 && lastGlobalKey.current !== 'ACTIVE') {
       const firstGlobal = visitasGlobal.find(v => v.latitud && v.longitud);
       if (firstGlobal) {
          const newCenter = [parseFloat(firstGlobal.latitud), parseFloat(firstGlobal.longitud)];
          setCurrentCenter(newCenter);
          setCurrentZoom(13);
          lastGlobalKey.current = 'ACTIVE';
       }
    } else if (!mostrarRutasGlobales) {
      lastGlobalKey.current = null;
    }

    // 5. Crear Rutas: Centrar si cambia el personal o servicio
    if (mostrarCrearRutas && visitasProgramadas.length > 0) {
      const firstProgramada = visitasProgramadas.find(v => v.latitud && v.longitud);
      if (firstProgramada && (crearRutasFilters?.id_personal !== lastPersonalId.current || crearRutasFilters?.id_servicio !== lastServicioId.current)) {
        const newCenter = [parseFloat(firstProgramada.latitud), parseFloat(firstProgramada.longitud)];
        setCurrentCenter(newCenter);
        setCurrentZoom(14);
        lastPersonalId.current = crearRutasFilters?.id_personal;
        lastServicioId.current = crearRutasFilters?.id_servicio;
      }
    }
  }, [
    selectedPacienteId, 
    mostrarProfesionales, 
    profesionalesFilters?.id_profesional, 
    visitas, 
    pacientesPuntos,
    mostrarRutasGlobales,
    visitasGlobal,
    selectedComunas,
    mostrarCrearRutas,
    visitasProgramadas,
    crearRutasFilters?.id_personal,
    crearRutasFilters?.id_servicio,
    mostrarVerRutas,
    selectedRutaId,
    routeVisitas
  ]);

  return { center: currentCenter, zoom: currentZoom, INITIAL_POSITION };
};
