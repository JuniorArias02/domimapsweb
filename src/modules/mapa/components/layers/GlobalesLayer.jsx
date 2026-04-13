import React from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { MapPin, Globe } from 'lucide-react';
import { useMapIcons } from '../../hooks/useMapIcons';
import { DATE_COLORS } from '../../constants/mapColors';
import { useMapaStore } from '../../store/mapaStore';

export const GlobalesLayer = ({
  visitasGlobal,
  mostrarRutasGlobales,
  isRulerActive
}) => {
  const { createProfessionalVisitIcon } = useMapIcons();
  const selectedBlocks = useMapaStore(state => state.rutasGlobalesFilters.bloques);

  if (!mostrarRutasGlobales) return null;

  // Filtrar visitas por bloque si hay bloques seleccionados (si está vacío, se muestran TODOS)
  const filteredVisits = visitasGlobal.filter(v => 
    selectedBlocks.length === 0 || selectedBlocks.includes(String(v.bloque_ruta))
  );

  const blocks = filteredVisits.reduce((acc, v) => {
    const b = v.bloque_ruta || 'S/B';
    if (!acc[b]) acc[b] = [];
    acc[b].push(v);
    return acc;
  }, {});

  return Object.entries(blocks).map(([block, blockVisits], bIdx) => {
    const color = DATE_COLORS[bIdx % DATE_COLORS.length];
    const validVisits = blockVisits.filter(v => 
      v.latitud && v.longitud && !isNaN(parseFloat(v.latitud)) && !isNaN(parseFloat(v.longitud))
    );
    if (validVisits.length === 0) return null;
    
    const positions = validVisits.map(v => [parseFloat(v.latitud), parseFloat(v.longitud)]);

    return (
      <React.Fragment key={`global-block-${block}`}>
        <Polyline 
          positions={positions} 
          pathOptions={{ color: color, weight: 4, opacity: 0.8 }} 
        />
        {validVisits.map((v) => (
          <Marker 
            key={`global-node-${v.id_paciente}-${v.orden_global}`} 
            position={[parseFloat(v.latitud), parseFloat(v.longitud)]}
            icon={createProfessionalVisitIcon(v.orden_global, color)}
            interactive={!isRulerActive}
          >
            <Popup>
              <div className="bg-[#1D4ED8] text-white px-3 py-1.5 -mt-4 -mx-4 mb-2 rounded-t-lg font-black text-[10px] uppercase flex items-center justify-between">
                 <div className="flex items-center gap-1.5"><Globe size={12} /> Bloque {block}</div>
                 <div className="bg-white/20 px-2 py-0.5 rounded text-[8px]">#{v.orden_global}</div>
              </div>
              <div className="font-black text-sm text-[#111827] uppercase leading-tight mb-1">
                {v.nombre_paciente}
              </div>
              <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase">
                 Proyectada: {v.fecha_proyectada}
              </div>
              <div className="text-[10px] text-gray-400 mt-2 leading-[1.2] flex items-start gap-1">
                <MapPin size={10} className="flex-shrink-0 mt-0.5" />
                {v.direccion}
              </div>
            </Popup>
          </Marker>
        ))}
      </React.Fragment>
    );
  });
};
