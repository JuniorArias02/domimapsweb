import React from 'react';
import { Polygon, Popup } from 'react-leaflet';
import { comunas } from '../../constants/comunas';

export const ComunasLayer = ({ selectedComunas }) => {
  return (
    <>
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
    </>
  );
};
