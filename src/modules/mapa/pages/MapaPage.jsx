import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../resources/MapClusters.css';
import { 
  Phone, MapPin, User, TrendingUp,
  Ruler, MousePointer2, Globe, X
} from 'lucide-react';

// --- Store & UI Components ---
import { useMapaStore } from '../store/mapaStore';
import MapSidebar from '../components/MapSidebar';
import MapPacientesMenu from '../components/MapPacientesMenu';
import MapProfesionalesMenu from '../components/MapProfesionalesMenu';
import MapDetallePaciente from '../components/MapDetallePaciente';
import MapComunasMenu from '../components/MapComunasMenu';
import MapPacientesComunaMenu from '../components/MapPacientesComunaMenu';
import MapRutasGlobalesMenu from '../components/MapRutasGlobalesMenu';
import MapOptimizadorMenu from '../components/MapOptimizadorMenu';
import MapSearchBox from '../components/MapSearchBox';
import MapRuler from '../components/MapRuler';
import { MapChangeView } from '../components/MapChangeView';

// --- Layers ---
import { PacientesLayer } from '../components/layers/PacientesLayer';
import { ProfesionalesLayer } from '../components/layers/ProfesionalesLayer';
import { GlobalesLayer } from '../components/layers/GlobalesLayer';
import { OptimizadorLayer } from '../components/layers/OptimizadorLayer';
import { ComunasLayer } from '../components/layers/ComunasLayer';

// --- Hooks & Logic ---
import { useMapaPacientesQuery } from '../queries/useMapaPacientesQuery';
import { usePacientesComunaQuery } from '../queries/usePacientesComunaQuery';
import { useRutasVisitasQuery } from '../queries/useRutasVisitasQuery';
import { useRutasGlobalesQuery } from '../queries/useRutasGlobalesQuery';
import { useOptimizarRutasQuery } from '../queries/useOptimizarRutasQuery';
import { useMapIcons } from '../hooks/useMapIcons';
import { useMapaCenter } from '../hooks/useMapaCenter';

import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Corrige problema común de Vite con los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const MapaPage = () => {
  // Estado modular del mapa
  const { 
    mostrarPacientes, 
    mostrarProfesionales, 
    selectedPacienteId, 
    seleccionarPaciente,
    selectedComunas,
    tipoVistaPacientes,
    filtroComunaId,
    mostrarRutasGlobales,
    rutasGlobalesFilters,
    mostrarOptimizador,
    optimizadorFilters,
    isComparingLocalRoute,
    localOptimizedRoute,
    isRulerActive,
    toggleRuler,
    profesionalesFilters
  } = useMapaStore();

  const { checkpointIcon } = useMapIcons();
  
  // --- Data Queries ---
  const { data: mapaData } = useMapaPacientesQuery();
  const pacientesPuntos = mapaData?.data || [];

  const { data: pacientesComunaData } = usePacientesComunaQuery(filtroComunaId);
  const pacientesComuna = pacientesComunaData?.data || [];

  const { data: rutasData } = useRutasVisitasQuery();
  const visitas = rutasData?.data || [];

  const { data: rutasGlobalData } = useRutasGlobalesQuery();
  const visitasGlobal = rutasGlobalData?.data || [];

  const { data: optimizadorData } = useOptimizarRutasQuery();
  const visitasOptimizadas = optimizadorData?.data || [];

  // --- Map Centering Logic ---
  const { center, zoom, INITIAL_POSITION } = useMapaCenter({
    pacientesPuntos,
    visitas,
    visitasGlobal,
    selectedPacienteId,
    mostrarProfesionales,
    profesionalesFilters,
    mostrarRutasGlobales,
    rutasGlobalesFilters,
    mostrarOptimizador,
    optimizadorFilters,
    selectedComunas
  });

  return (
    <div className="w-full h-[100dvh] relative z-0 overflow-hidden">
      
      {/* Buscador Superior del Mapa */}
      <MapSearchBox />

      {/* Componentes Modulares de Sidebars */}
      <MapSidebar />
      <MapPacientesMenu />
      <MapProfesionalesMenu />
      <MapDetallePaciente />
      <MapComunasMenu />
      <MapPacientesComunaMenu />
      <MapRutasGlobalesMenu />
      <MapOptimizadorMenu />

      <MapContainer 
        center={INITIAL_POSITION} 
        zoom={13} 
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        preferCanvas={true}
        className="w-full h-[100dvh] absolute inset-0 z-0"
      >
        <MapChangeView center={center} zoom={zoom} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRuler />
        
        {/* Marcador del Checkpoint Principal (Dorado) */}
        <Marker position={INITIAL_POSITION} icon={checkpointIcon}>
          <Popup>
            <div className="font-bold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              Punto de control inicial
            </div>
            <div className="text-xs text-gray-500 mt-1">Ubicación estratégica de referencia.</div>
          </Popup>
        </Marker>

        {/* Layers Modulares */}
        <PacientesLayer 
          pacientesPuntos={pacientesPuntos}
          pacientesComuna={pacientesComuna}
          tipoVistaPacientes={tipoVistaPacientes}
          selectedPacienteId={selectedPacienteId}
          seleccionarPaciente={seleccionarPaciente}
          mostrarPacientes={mostrarPacientes}
          isRulerActive={isRulerActive}
        />

        <ProfesionalesLayer 
          visitas={visitas}
          mostrarProfesionales={mostrarProfesionales}
          isComparingLocalRoute={isComparingLocalRoute}
          localOptimizedRoute={localOptimizedRoute}
          isRulerActive={isRulerActive}
        />

        <GlobalesLayer 
          visitasGlobal={visitasGlobal}
          mostrarRutasGlobales={mostrarRutasGlobales}
          isRulerActive={isRulerActive}
        />

        <OptimizadorLayer 
          visitasOptimizadas={visitasOptimizadas}
          mostrarOptimizador={mostrarOptimizador}
          isRulerActive={isRulerActive}
        />

        <ComunasLayer selectedComunas={selectedComunas} isRulerActive={isRulerActive} />

      </MapContainer>

      {/* Floating Map Controls (Ruler, etc) */}
      <div className="absolute bottom-10 right-8 z-[400] flex flex-col gap-3">
        {/* Botón de Limpiar Regla (Solo aparece si hay puntos) */}
        {isRulerActive && (
          <button
            onClick={() => useMapaStore.getState().clearRuler()}
            title="Borrar medición"
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all animate-in zoom-in duration-300"
          >
            <X size={20} />
          </button>
        )}

        {/* Botón Principal de Regla */}
        <button
          onClick={toggleRuler}
          title={isRulerActive ? 'Desactivar Regla' : 'Activar Regla (Medir Distancia)'}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 border backdrop-blur-md ${
            isRulerActive 
              ? 'bg-blue-600 border-blue-400 text-white' 
              : 'bg-white/90 border-gray-100 text-gray-500 hover:text-blue-600 hover:shadow-blue-500/10'
          }`}
        >
          {isRulerActive ? <MousePointer2 size={26} /> : <Ruler size={26} />}
          {isRulerActive && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default MapaPage;
