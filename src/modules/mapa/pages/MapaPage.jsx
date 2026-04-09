import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../resources/MapClusters.css';
import { Phone, MapPin, User, TrendingUp } from 'lucide-react';
import { useMapaStore } from '../store/mapaStore';
import MapSidebar from '../components/MapSidebar';
import MapPacientesMenu from '../components/MapPacientesMenu';
import MapProfesionalesMenu from '../components/MapProfesionalesMenu';
import MapDetallePaciente from '../components/MapDetallePaciente';
import MapComunasMenu from '../components/MapComunasMenu';
import MapPacientesComunaMenu from '../components/MapPacientesComunaMenu';
import MapRutasOptimizadasMenu from '../components/MapRutasOptimizadasMenu';
import { comunas } from '../constants/comunas';
import { useMapaPacientesQuery } from '../queries/useMapaPacientesQuery';
import { usePacientesComunaQuery } from '../queries/usePacientesComunaQuery';
import { useRutasVisitasQuery } from '../queries/useRutasVisitasQuery';
import { useRutasOptimizadasQuery } from '../queries/useRutasOptimizadasQuery';
import { useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useMapIcons } from '../hooks/useMapIcons';



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

// --- Cleaned up Icons - Now in useMapIcons hook ---

// Componente para manejar el centrado del mapa
const ChangeView = React.memo(({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
     map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
});



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
    filtroComunaId,
    mostrarRutasOptimizadas 
  } = useMapaStore();

  const { checkpointIcon, patientIconRegular, patientIconSelected, createProfessionalVisitIcon } = useMapIcons();
  
  // Data (usa la query paginada)
  const { data: mapaData } = useMapaPacientesQuery();
  const pacientesPuntos = mapaData?.data || [];

  // Data Opción 2: Pacientes por Comuna específica
  const { data: pacientesComunaData } = usePacientesComunaQuery(filtroComunaId);
  const pacientesComuna = pacientesComunaData?.data || [];

  // RUTAS PROFESIONALES: Agrupar por fecha_realizada
  const { data: rutasData } = useRutasVisitasQuery();
  const visitas = rutasData?.data || [];

  // RUTAS OPTIMIZADAS (PROYECTADAS)
  const { data: rutasOptimizadasData } = useRutasOptimizadasQuery();
  const visitasOptimizadas = rutasOptimizadasData?.data || [];

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
  } else if (mostrarRutasOptimizadas && visitasOptimizadas.length > 0) {
    const firstOpt = visitasOptimizadas.find(v => v.latitud && v.longitud);
    if (firstOpt) {
      mapCenter = [parseFloat(firstOpt.latitud), parseFloat(firstOpt.longitud)];
      mapZoom = 14;
    }
  }

  const dateColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

  const visitasByDay = visitas.reduce((acc, visit) => {
    if (!acc[visit.fecha_realizada]) acc[visit.fecha_realizada] = [];
    acc[visit.fecha_realizada].push(visit);
    return acc;
  }, {});

  const visitasOptinizadasByDay = visitasOptimizadas.reduce((acc, visit) => {
    const dateStr = visit.fecha_proyectada.split(' ')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(visit);
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
      <MapRutasOptimizadasMenu />



      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        preferCanvas={true}
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
        {mostrarPacientes && tipoVistaPacientes === 'GENERAL' && (
          <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds>
            {pacientesPuntos.map((pac, idx) => {
              if (!pac.latitud || !pac.longitud) return null;
              const pacPosition = [parseFloat(pac.latitud), parseFloat(pac.longitud)];
              const isSelected = selectedPacienteId === pac.id_paciente;

              return (
                <Marker 
                  key={`pac-gen-${pac.id_paciente || idx}`} 
                  position={pacPosition}
                  icon={isSelected ? patientIconSelected : patientIconRegular}
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
          </MarkerClusterGroup>
        )}

        {/* Marcadores de Pacientes (OPCIÓN 2: POR COMUNA) */}
        {mostrarPacientes && tipoVistaPacientes === 'POR_COMUNA' && (
          <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds>
            {pacientesComuna.map((pac, idx) => {
              if (!pac.latitud || !pac.longitud) return null;
              const pacPosition = [parseFloat(pac.latitud), parseFloat(pac.longitud)];
              const isSelected = selectedPacienteId === pac.id_paciente;

              return (
                <Marker 
                  key={`comuna-pac-${pac.id_paciente || idx}`} 
                  position={pacPosition}
                  icon={isSelected ? patientIconSelected : patientIconRegular}
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
          </MarkerClusterGroup>
        )}

        {/* Marcadores y Rutas de OPTIMIZACIÓN (INTELIGENCIA) */}
        {mostrarRutasOptimizadas && Object.entries(visitasOptinizadasByDay).map(([fecha, visitsForDay], dayIdx) => {
          visitsForDay.sort((a,b) => a.orden_visita - b.orden_visita);
          const color = dateColors[dayIdx % dateColors.length];
          
          const validVisits = visitsForDay.filter(v => 
            v.latitud && v.longitud && !isNaN(parseFloat(v.latitud)) && !isNaN(parseFloat(v.longitud))
          );
          
          if (validVisits.length === 0) return null;
          const positions = validVisits.map(v => [parseFloat(v.latitud), parseFloat(v.longitud)]);

          return (
            <React.Fragment key={`opt-${fecha}`}>
              <Polyline 
                positions={positions} 
                pathOptions={{ color: color, weight: 4, opacity: 0.9 }} 
              />
              
              {validVisits.map((v) => (
                <Marker 
                  key={`opt-visita-${v.id_orden}`} 
                  position={[parseFloat(v.latitud), parseFloat(v.longitud)]}
                  icon={createProfessionalVisitIcon(v.orden_visita, color)}
                >
                  <Popup>
                    <div className="bg-[#2563EB] text-white px-2 py-1 -mt-4 -mx-4 mb-2 rounded-t-lg font-black text-[10px] uppercase flex items-center gap-2">
                       <TrendingUp size={12} /> Ruta Optimizada
                    </div>
                    <div className="font-black text-sm text-[#111827] uppercase leading-tight mb-1">
                      {v.nombre_paciente}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase">
                       <span style={{color: color}}>Orden: {v.orden_visita}</span> | Proyectada: {fecha}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-2 leading-[1.2] flex items-start gap-1">
                      <MapPin size={10} className="flex-shrink-0 mt-0.5" />
                      {v.direccion}
                    </div>
                    {v.observaciones_optimizacion && (
                       <div className="mt-3 p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-[9px] font-black uppercase italic">
                         Nota: {v.observaciones_optimizacion}
                       </div>
                    )}
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
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
