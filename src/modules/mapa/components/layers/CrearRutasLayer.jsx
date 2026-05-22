import React from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { MapPin, Route, Activity } from 'lucide-react';
import { useMapaStore } from '../../store/mapaStore';
import { useVisitasProgramadasQuery } from '../../queries/useVisitasProgramadasQuery';
import L from 'leaflet';

export const CrearRutasLayer = ({ isRulerActive }) => {
  const { 
    mostrarCrearRutas, 
    selectedVisitasIds, 
    toggleSelectedVisita 
  } = useMapaStore();

  const { data: visitasResult } = useVisitasProgramadasQuery();
  const visits = visitasResult?.data || [];

  if (!mostrarCrearRutas) return null;

  // Filter valid visits with coordinates
  const validVisits = visits.filter(v => 
    v.latitud && v.longitud && !isNaN(parseFloat(v.latitud)) && !isNaN(parseFloat(v.longitud))
  );

  // Helper to create custom div icon
  const getVisitaIcon = (isSelected, selectionOrderIndex) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isSelected ? `
            <div class="absolute w-8 h-8 bg-indigo-500/25 rounded-full animate-ping"></div>
          ` : ''}
          <div style="
            background-color: ${isSelected ? '#4F46E5' : '#C7D2FE'}; 
            width: ${isSelected ? '26px' : '18px'}; 
            height: ${isSelected ? '26px' : '18px'}; 
            border-radius: 50%; 
            border: 2px solid white; 
            box-shadow: 0 0 10px ${isSelected ? 'rgba(79, 70, 229, 0.4)' : 'rgba(199, 210, 254, 0.3)'};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 900;
            font-size: ${isSelected ? '10px' : '8px'};
            transition: all 0.3s;
          " class="group-hover:scale-110">
            ${isSelected ? selectionOrderIndex : ''}
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  // Map selected visits in the exact order they were selected
  const selectedVisitsInOrder = selectedVisitasIds
    .map(id => validVisits.find(v => v.id_visita === id))
    .filter(Boolean);

  const polylinePositions = selectedVisitsInOrder.map(v => [
    parseFloat(v.latitud),
    parseFloat(v.longitud)
  ]);

  return (
    <>
      {/* Route Line connecting selected points in selection order */}
      {polylinePositions.length > 1 && (
        <Polyline 
          positions={polylinePositions} 
          pathOptions={{ color: '#4F46E5', weight: 4, opacity: 0.8, dashArray: '10, 10' }} 
        />
      )}

      {/* Markers for all visits matching filters */}
      {validVisits.map((v) => {
        const selectionIndex = selectedVisitasIds.indexOf(v.id_visita);
        const isSelected = selectionIndex !== -1;
        const displayIndex = isSelected ? selectionIndex + 1 : '';

        return (
          <Marker 
            key={`crear-ruta-node-${v.id_visita}`} 
            position={[parseFloat(v.latitud), parseFloat(v.longitud)]}
            icon={getVisitaIcon(isSelected, displayIndex)}
            interactive={!isRulerActive}
            eventHandlers={{
              click: () => {
                toggleSelectedVisita(v.id_visita);
              }
            }}
          >
            <Popup>
              <div className="bg-indigo-600 text-white px-3 py-1.5 -mt-4 -mx-4 mb-2 rounded-t-lg font-black text-[10px] uppercase flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Route size={12} /> Visita Programada
                </div>
                {isSelected && (
                  <div className="bg-white/20 px-2 py-0.5 rounded text-[8px]">
                    Orden: #{displayIndex}
                  </div>
                )}
              </div>
              
              <div className="font-black text-sm text-[#111827] uppercase leading-tight mb-1">
                {v.paciente}
              </div>
              
              <div className="text-[10px] text-gray-400 mt-2 leading-[1.2] flex items-start gap-1">
                <MapPin size={10} className="flex-shrink-0 mt-0.5" />
                <span>{v.direccion}</span>
              </div>

              <div className="text-[10px] text-gray-400 mt-1 leading-[1.2] flex items-start gap-1">
                <Activity size={10} className="flex-shrink-0 mt-0.5" />
                <span>{v.codigo_servicio} - {v.nombre_servicio}</span>
              </div>

              <div className="text-[10px] text-gray-600 font-bold mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                <span>Prof: {v.nombre_profesional || 'Sin asignar'}</span>
                <span>{v.fecha_programada}</span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
