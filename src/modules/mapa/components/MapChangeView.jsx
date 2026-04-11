import React from 'react';
import { useMap } from 'react-leaflet';

export const MapChangeView = React.memo(({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
     // Solo re-centrar si la diferencia es significativa para evitar "bucles" de movimiento
     const currentCenter = map.getCenter();
     const dist = Math.sqrt(
       Math.pow(currentCenter.lat - center[0], 2) + 
       Math.pow(currentCenter.lng - center[1], 2)
     );
     
     if (dist > 0.0001 || Math.abs(map.getZoom() - zoom) > 0.1) {
        map.setView(center, zoom, { animate: true });
     }
  }, [center, zoom, map]);
  return null;
});
