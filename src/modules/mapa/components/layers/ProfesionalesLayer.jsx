import React from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { MapPin, TrendingUp } from 'lucide-react';
import { useMapIcons } from '../../hooks/useMapIcons';
import { DATE_COLORS } from '../../constants/mapColors';
import { groupByDate } from '../../utils/groupByDate';

export const ProfesionalesLayer = ({
  visitas,
  mostrarProfesionales,
  isComparingLocalRoute,
  localOptimizedRoute,
  isRulerActive
}) => {
  const { createProfessionalVisitIcon: iconFactory } = useMapIcons();
  
  if (!mostrarProfesionales) return null;

  const visitasByDay = groupByDate(visitas);

  return (
    <>
      {/* Rutas de Profesionales por Día */}
      {Object.entries(visitasByDay).map(([fecha, visitsForDay], dayIdx) => {
        visitsForDay.sort((a, b) => a.orden_visita - b.orden_visita);
        const color = isComparingLocalRoute ? '#94A3B8' : DATE_COLORS[dayIdx % DATE_COLORS.length];

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
              pathOptions={{
                color: color,
                weight: isComparingLocalRoute ? 2 : 3,
                dashArray: '6, 6',
                opacity: isComparingLocalRoute ? 0.4 : 0.8
              }}
            />

            {!isComparingLocalRoute && validVisits.map((v) => (
              <Marker
                key={v.id_visita}
                position={[parseFloat(v.latitud), parseFloat(v.longitud)]}
                icon={iconFactory(v.orden_visita, color)}
                interactive={!isRulerActive}
              >
                <Popup>
                  <div className="font-black text-sm text-[#111827] uppercase leading-tight mb-1">
                    {v.nombre_paciente}
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase">
                    <span style={{ color: color }}>Orden: {v.orden_visita}</span> | Fecha: {v.fecha_realizada}
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

      {/* RUTA OPTIMIZADA LOCAL (COMPARATIVA) */}
      {isComparingLocalRoute && localOptimizedRoute.length > 0 && (() => {
        const color = '#10B981'; // Emerald-500
        const positions = localOptimizedRoute.map(v => [parseFloat(v.latitud), parseFloat(v.longitud)]);

        return (
          <React.Fragment>
            <Polyline
              positions={positions}
              pathOptions={{ color: color, weight: 4, opacity: 1 }}
            />

            {localOptimizedRoute.map((v, idx) => (
              <Marker
                key={`local-opt-${v.id_visita || idx}`}
                position={[parseFloat(v.latitud), parseFloat(v.longitud)]}
                icon={iconFactory(v.orden_visita_opt, color)}
                interactive={!isRulerActive}
              >
                <Popup>
                  <div className="bg-emerald-600 text-white px-2 py-1 -mt-4 -mx-4 mb-2 rounded-t-lg font-black text-[10px] uppercase flex items-center gap-2">
                    <TrendingUp size={12} /> Sugerencia de Ruta
                  </div>
                  <div className="font-black text-sm text-[#111827] uppercase leading-tight mb-1">
                    {v.nombre_paciente}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mb-1 uppercase">
                    Nuevo Orden: {v.orden_visita_opt} <span className="text-gray-300 mx-1">|</span> <span className="text-gray-400">Anterior: {v.orden_visita}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2 leading-[1.2] flex items-start gap-1">
                    <MapPin size={10} className="flex-shrink-0 mt-0.5" />
                    {v.direccion}
                  </div>
                </Popup>
              </Marker>
            ))}
          </React.Fragment>
        );
      })()}
    </>
  );
};
