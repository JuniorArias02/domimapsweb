import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { User, MapPin } from 'lucide-react';
import { useMapIcons } from '../../hooks/useMapIcons';

export const PacientesLayer = ({ 
  pacientesPuntos, 
  pacientesComuna, 
  tipoVistaPacientes,
  selectedPacienteId,
  seleccionarPaciente,
  mostrarPacientes,
  isRulerActive
}) => {
  const { patientIconRegular, patientIconSelected } = useMapIcons();

  if (!mostrarPacientes) return null;

  if (tipoVistaPacientes === 'GENERAL') {
    return (
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
              interactive={!isRulerActive}
              eventHandlers={{
                click: () => !isRulerActive && seleccionarPaciente(pac.id_paciente),
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
    );
  }

  if (tipoVistaPacientes === 'POR_COMUNA') {
    return (
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
              interactive={!isRulerActive}
              eventHandlers={{
                click: () => !isRulerActive && seleccionarPaciente(pac.id_paciente),
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
    );
  }

  return null;
};
