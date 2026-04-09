import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, MapPin, User } from 'lucide-react';
import { useMapaStore } from '../store/mapaStore';
import MapSidebar from '../components/MapSidebar';
import MapPacientesMenu from '../components/MapPacientesMenu';
import MapProfesionalesMenu from '../components/MapProfesionalesMenu';
import MapDetallePaciente from '../components/MapDetallePaciente';
import MapComunasMenu from '../components/MapComunasMenu';
import MapPacientesComunaMenu from '../components/MapPacientesComunaMenu';
import { comunas } from '../constants/comunas';
import { useMapaPacientesQuery } from '../queries/useMapaPacientesQuery';
import { usePacientesComunaQuery } from '../queries/usePacientesComunaQuery';
import { useRutasVisitasQuery } from '../queries/useRutasVisitasQuery';
import { useMap } from 'react-leaflet';



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

// --- Custom Icons Definitions ---

// Estilo Dorado para el Checkpoint Principal
const checkpointIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div style="
      background-color: #EAB308; 
      width: 14px; 
      height: 14px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Estilo para Pacientes (Azul con Pulso)
const createPatientIcon = (isSelected) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      ${isSelected ? `
        <div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
      ` : ''}
      <div style="
        background-color: ${isSelected ? '#2563EB' : '#60A5FA'}; 
        width: ${isSelected ? '16px' : '12px'}; 
        height: ${isSelected ? '16px' : '12px'}; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
        transition: all 0.3s;
      "></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Estilo para Puntos de Ruta del Profesional
const createProfessionalVisitIcon = (order, dateColor) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center group cursor-pointer">
      <div style="
        background-color: ${dateColor}; 
        width: 24px; 
        height: 24px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 0 10px ${dateColor}60;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 900;
        font-size: 11px;
        transition: all 0.3s;
      " class="group-hover:scale-110">${order}</div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Componente para manejar el centrado del mapa
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom, { animate: true });
  return null;
};



const MapaPage = () => {
  // Checkpoint ficticio (ubicación inicial)
  const position = [7.886053739251232, -72.497568179007]; // Bogotá como punto de inicio por defecto
  
  // Estado modular del mapa
  const { 
    mostrarPacientes, 
    mostrarProfesionales, 
    selectedPacienteId, 
    seleccionarPaciente,
    selectedComunas,
    tipoVistaPacientes,
    filtroComunaId 
  } = useMapaStore();
  
  // Data (usa la query paginada)
  const { data: mapaData } = useMapaPacientesQuery();
  const pacientesPuntos = mapaData?.data || [];

  // Data Opción 2: Pacientes por Comuna específica
  const { data: pacientesComunaData } = usePacientesComunaQuery(filtroComunaId);
  const pacientesComuna = pacientesComunaData?.data || [];

  // RUTAS PROFESIONALES: Agrupar por fecha_realizada
  const { data: rutasData } = useRutasVisitasQuery();
  const visitas = rutasData?.data || [];

  // Lógica de centrado inteligente
  const selectedPac = pacientesPuntos.find(p => p.id_paciente === selectedPacienteId);
  const firstVisit = visitas.find(v => v.latitud && v.longitud);

  let mapCenter = position;
  let mapZoom = 13;

  if (selectedPac?.latitud) {
    mapCenter = [parseFloat(selectedPac.latitud), parseFloat(selectedPac.longitud)];
    mapZoom = 16;
  } else if (mostrarProfesionales && firstVisit?.latitud) {
    mapCenter = [parseFloat(firstVisit.latitud), parseFloat(firstVisit.longitud)];
    mapZoom = 14;
  }

  const dateColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

  const visitasByDay = visitas.reduce((acc, visit) => {
    if (!acc[visit.fecha_realizada]) acc[visit.fecha_realizada] = [];
    acc[visit.fecha_realizada].push(visit);
    return acc;
  }, {});

  return (
    <div className="w-full h-[100dvh] relative z-0 overflow-hidden">
      
      {/* Componentes Modulares de Sidebars */}
      <MapSidebar />
      <MapPacientesMenu />
      <MapProfesionalesMenu />
      <MapDetallePaciente />
      <MapComunasMenu />
      <MapPacientesComunaMenu />



      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-[100dvh] absolute inset-0 z-0"
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador del Checkpoint Principal (Dorado) */}
        <Marker position={position} icon={checkpointIcon}>
          <Popup>
            <div className="font-bold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              Punto de control inicial
            </div>
            <div className="text-xs text-gray-500 mt-1">Ubicación estratégica de referencia.</div>
          </Popup>
        </Marker>


        {/* Marcadores de Pacientes (OPCIÓN 1: GENERAL) */}
        {mostrarPacientes && tipoVistaPacientes === 'GENERAL' && pacientesPuntos.map((pac, idx) => {
          // Usa coordenadas reales. Si no existen, no renderiza marcador.
          if (!pac.latitud || !pac.longitud) return null;
          
          const pacPosition = [parseFloat(pac.latitud), parseFloat(pac.longitud)];

          return (
            <Marker 
              key={pac.id_paciente || idx} 
              position={pacPosition}
              icon={createPatientIcon(selectedPacienteId === pac.id_paciente)}
              eventHandlers={{
                click: () => seleccionarPaciente(pac.id_paciente),
              }}
            >


              <Popup>
                <div className="font-black text-sm text-[#111827] uppercase leading-tight mb-1 flex items-center justify-between">
                  <span>{pac.nombre_completo}</span>
                  <div className="bg-green-100 text-green-700 p-1 rounded-full ml-2" title="Paciente Válido">
                    <User size={12} strokeWidth={3} />
                  </div>
                </div>
                {pac.estado && (
                  <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> 
                    {pac.estado}
                  </div>
                )}
                <div className="text-[10px] text-gray-500 mt-2 font-mono">
                  ID: {pac.id_paciente}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Marcadores de Pacientes (OPCIÓN 2: POR COMUNA) */}
        {mostrarPacientes && tipoVistaPacientes === 'POR_COMUNA' && pacientesComuna.map((pac, idx) => {
          if (!pac.latitud || !pac.longitud) return null;
          const pacPosition = [parseFloat(pac.latitud), parseFloat(pac.longitud)];

          return (
            <Marker 
              key={`comuna-pac-${pac.id_paciente || idx}`} 
              position={pacPosition}
              icon={createPatientIcon(selectedPacienteId === pac.id_paciente)}
              eventHandlers={{
                click: () => seleccionarPaciente(pac.id_paciente),
              }}
            >
              <Popup>
                <div className="font-black text-sm text-[#111827] uppercase leading-tight mb-1 flex items-center justify-between">
                  <span>{pac.nombre_completo}</span>
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full ml-2" title="Paciente en Comuna">
                    <MapPin size={12} strokeWidth={3} />
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 mt-2 font-mono">
                  ID: {pac.id_paciente} | Cédula: {pac.identificacion}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Marcadores y Rutas de Profesionales */}
        {mostrarProfesionales && Object.entries(visitasByDay).map(([fecha, visitsForDay], dayIdx) => {
          // Ordenar por orden_visita
          visitsForDay.sort((a,b) => a.orden_visita - b.orden_visita);
          const color = dateColors[dayIdx % dateColors.length];
          
          // Filtrar coordenadas válidas (que no sean null, undefined o NaN)
          const validVisits = visitsForDay.filter(v => 
            v.latitud && 
            v.longitud && 
            !isNaN(parseFloat(v.latitud)) && 
            !isNaN(parseFloat(v.longitud))
          );
          
          if (validVisits.length === 0) return null;
          
          const positions = validVisits.map(v => [parseFloat(v.latitud), parseFloat(v.longitud)]);

          return (
            <React.Fragment key={fecha}>
              <Polyline 
                positions={positions} 
                pathOptions={{ color: color, weight: 3, dashArray: '6, 6', opacity: 0.8 }} 
              />
              
              {validVisits.map((v) => (
                <Marker 
                  key={v.id_visita} 
                  position={[parseFloat(v.latitud), parseFloat(v.longitud)]}
                  icon={createProfessionalVisitIcon(v.orden_visita, color)}
                >
                  <Popup>
                    <div className="font-black text-sm text-[#111827] uppercase leading-tight mb-1">
                      {v.nombre_paciente}
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase">
                      <span style={{color: color}}>Orden: {v.orden_visita}</span> | Fecha: {v.fecha_realizada}
                    </div>
                    <div className="text-[10px] text-gray-400 font-black mt-2 leading-[1.2]">
                      <MapPin size={10} className="inline mr-1" />
                      {v.direccion}
                    </div>
                    <div className="text-[#10B981] font-bold text-[9px] mt-2 border-t pt-1 uppercase">
                      Prof: {v.nombre_profesional}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}

        {/* Capas de Comunas (Polígonos) */}
        {selectedComunas.map((comunaId) => {
          const info = comunas[comunaId];
          if (!info) return null;
          
          return (
            <Polygon
              key={comunaId}
              positions={info.coords}
              pathOptions={{
                fillColor: info.color,
                fillOpacity: 0.3,
                color: info.color,
                weight: 2,
                dashArray: '5, 5'
              }}
            >
              <Popup>
                <div className="font-black text-xs uppercase text-gray-800">
                  {info.nombre}
                </div>
              </Popup>
            </Polygon>
          );
        })}

      </MapContainer>
    </div>
  );
};

export default MapaPage;
