import React from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { MapPin, User, Activity } from 'lucide-react';
import { useMapaStore } from '../../store/mapaStore';
import { useDetalleRutaQuery } from '../../queries/useDetalleRutaQuery';
import L from 'leaflet';

export const RutasLayer = ({ isRulerActive }) => {
  const { 
    mostrarVerRutas, 
    selectedRutaId,
    seleccionarPaciente 
  } = useMapaStore();

  const { data: detailResult } = useDetalleRutaQuery(selectedRutaId);
  
  if (!mostrarVerRutas || !selectedRutaId) return null;

  const routeDetails = detailResult?.data || {};
  const visits = routeDetails.visitas || [];

  // Filter valid visits with patient coordinates
  const validVisits = visits.filter(v => {
    const paciente = v.paciente || {};
    return paciente.latitud && paciente.longitud && 
      !isNaN(parseFloat(paciente.latitud)) && !isNaN(parseFloat(paciente.longitud));
  });

  // Helper to create custom div icon
  const getVisitaIcon = (orderIndex) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute w-8 h-8 bg-indigo-500/25 rounded-full animate-ping"></div>
          <div style="
            background-color: #4F46E5; 
            width: 26px; 
            height: 26px; 
            border-radius: 50%; 
            border: 2px solid white; 
            box-shadow: 0 0 10px rgba(79, 70, 229, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 900;
            font-size: 10px;
            transition: all 0.3s;
          " class="group-hover:scale-110">
            ${orderIndex}
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  const polylinePositions = validVisits.map(v => [
    parseFloat(v.paciente.latitud),
    parseFloat(v.paciente.longitud)
  ]);

  return (
    <>
      {/* Route Line connecting visits in sequential order */}
      {polylinePositions.length > 1 && (
        <Polyline 
          positions={polylinePositions} 
          pathOptions={{ color: '#4F46E5', weight: 4, opacity: 0.8, dashArray: '10, 10' }} 
        />
      )}

      {/* Markers for all visits in the selected route */}
      {validVisits.map((v, index) => {
        const paciente = v.paciente || {};
        const displayIndex = v.orden_visita || (index + 1);

        return (
          <Marker 
            key={`ver-ruta-node-${v.id_visita}`} 
            position={[parseFloat(paciente.latitud), parseFloat(paciente.longitud)]}
            icon={getVisitaIcon(displayIndex)}
            interactive={!isRulerActive}
            eventHandlers={{
              click: () => {
                seleccionarPaciente(paciente.id_paciente, paciente);
              }
            }}
          >
            <Popup>
              <div className="p-1 font-sans text-xs max-w-xs">
                <div className="flex items-center gap-1 font-black text-gray-900 uppercase mb-1">
                  <User size={12} className="text-indigo-600" />
                  Parada #{displayIndex}: {paciente.nombre_completo}
                </div>
                <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                  ID: {paciente.identificacion}
                </div>
                <div className="flex items-start gap-1 text-[10px] text-gray-600">
                  <MapPin size={10} className="text-gray-400 mt-0.5" />
                  <span>{paciente.direccion}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
