import React from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { MapPin, Zap } from 'lucide-react';
import { useMapIcons } from '../../hooks/useMapIcons';
import { DATE_COLORS } from '../../constants/mapColors';
import { useMapaStore } from '../../store/mapaStore';

export const OptimizadorLayer = ({
  visitasOptimizadas,
  mostrarOptimizador,
  isRulerActive
}) => {
  const { createProfessionalVisitIcon } = useMapIcons();
  const selectedBlocks = useMapaStore(state => state.optimizadorFilters.bloques);

  if (!mostrarOptimizador) return null;

  // Filtrar visitas por bloque si hay bloques seleccionados
  const filteredVisits = visitasOptimizadas.filter(v => 
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
      <React.Fragment key={`optimizador-block-${block}`}>
        <Polyline 
          positions={positions} 
          pathOptions={{ color: color, weight: 4, opacity: 0.8, dashArray: '10, 10' }} 
        />
        {validVisits.map((v, idx) => (
          <Marker 
            key={`optimizador-node-${v.id_paciente}-${idx}`} 
            position={[parseFloat(v.latitud), parseFloat(v.longitud)]}
            icon={createProfessionalVisitIcon(v.orden_en_ruta, color)}
            interactive={!isRulerActive}
          >
            <Popup>
              <div className="bg-amber-500 text-white px-3 py-1.5 -mt-4 -mx-4 mb-2 rounded-t-lg font-black text-[10px] uppercase flex items-center justify-between">
                 <div className="flex items-center gap-1.5"><Zap size={12} /> Bloque {block}</div>
                 <div className="bg-white/20 px-2 py-0.5 rounded text-[8px]">#{v.orden_en_ruta}</div>
              </div>
              <div className="font-black text-sm text-[#111827] uppercase leading-tight mb-1">
                {v.paciente}
              </div>
              <div className="text-[10px] text-gray-400 mt-2 leading-[1.2] flex items-start gap-1">
                <MapPin size={10} className="flex-shrink-0 mt-0.5" />
                ID: {v.id_paciente}
              </div>
            </Popup>
          </Marker>
        ))}
      </React.Fragment>
    );
  });
};
