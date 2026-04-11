import React from 'react';
import { useMapEvents, Polyline, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMapaStore } from '../store/mapaStore';
import { calculateDistance } from '../utils/routeUtils';
import { Ruler } from 'lucide-react';

export default function MapRuler() {
  const { isRulerActive, rulerPoints, addRulerPoint } = useMapaStore();
  const map = useMap();

  useMapEvents({
    click(e) {
      if (isRulerActive) {
        addRulerPoint([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  // Cursor style when ruler is active
  React.useEffect(() => {
    if (isRulerActive) {
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.getContainer().style.cursor = '';
    }
  }, [isRulerActive, map]);

  if (!isRulerActive || rulerPoints.length === 0) return null;

  const distance = rulerPoints.length === 2 
    ? calculateDistance(rulerPoints[0][0], rulerPoints[0][1], rulerPoints[1][0], rulerPoints[1][1])
    : 0;

  const formattedDistance = distance < 1 
    ? `${(distance * 1000).toFixed(0)} m` 
    : `${distance.toFixed(2)} km`;

  // Custom icon for ruler points (Modern & Sharp)
  const rulerPointIcon = L.divIcon({
    className: 'ruler-point-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-5 h-5 bg-blue-500/20 rounded-full animate-ping"></div>
        <div class="relative w-4 h-4 bg-white border-4 border-blue-600 rounded-full shadow-lg"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  return (
    <>
      {rulerPoints.map((point, idx) => (
        <Marker 
          key={`ruler-p-${idx}`} 
          position={point} 
          icon={rulerPointIcon}
          interactive={false}
        />
      ))}

      {rulerPoints.length === 2 && (
        <Polyline 
          positions={rulerPoints} 
          pathOptions={{ 
            color: '#2563EB', 
            weight: 5, 
            dashArray: '1, 10', 
            lineCap: 'round',
            opacity: 0.9 
          }}
        >
          <Tooltip 
            permanent 
            direction="top" 
            offset={[0, -15]}
            className="ruler-tooltip-custom"
          >
            <div className="flex flex-col items-center gap-1 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl border border-blue-100 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Ruler size={14} className="text-blue-600" />
                </div>
                <span className="text-lg font-black text-gray-900 tracking-tighter">
                  {formattedDistance}
                </span>
              </div>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Distancia Lineal</span>
            </div>
          </Tooltip>
        </Polyline>
      )}
    </>
  );
}
