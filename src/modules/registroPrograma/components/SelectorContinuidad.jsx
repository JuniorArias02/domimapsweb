import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Loader2, CheckCircle2, History } from 'lucide-react';
import { useHistorialTratamientosQuery } from '../../agendamiento/queries/useAgendasQuery';
import ModalBusquedaContinuidad from './ModalBusquedaContinuidad';

export default function SelectorContinuidad({ idPaciente, idServicio, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectRef = useRef(null);

  const { data: historialTratamientos, isLoading } = useHistorialTratamientosQuery(idPaciente, idServicio);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update label if value changes or suggestions load
  useEffect(() => {
    if (!value) {
      setSelectedLabel('-- Tratamiento Nuevo (Sin continuidad) --');
      return;
    }
    if (historialTratamientos) {
      const found = historialTratamientos.find(h => String(h.id_orden_servicio) === String(value));
      if (found) {
        setSelectedLabel(`${found.nombre_servicio} (Ingreso: ${found.id_ingreso} - Fecha: ${found.fecha_ingreso})`);
      }
    }
  }, [value, historialTratamientos]);

  const handleSelect = (id, label) => {
    onChange({ target: { name: 'id_orden_servicio_anterior', value: id } });
    if (label) setSelectedLabel(label);
    setIsOpen(false);
  };

  if (!idServicio) {
    return (
      <div className="relative">
        <div className="w-full pl-4 pr-10 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed flex items-center justify-between">
          <span>-- Seleccione un servicio primero --</span>
          <ChevronDown size={18} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={selectRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-4 pr-10 py-3 text-sm font-bold bg-white border border-gray-100 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${
          isOpen ? 'ring-4 ring-blue-500/10 border-blue-500' : 'hover:border-blue-100'
        }`}
      >
        <span className="truncate text-gray-700">
          {selectedLabel || '-- Tratamiento Nuevo (Sin continuidad) --'}
        </span>
        <div className="absolute right-4 text-gray-400 flex items-center">
          {isLoading ? <Loader2 size={16} className="animate-spin text-blue-500" /> : <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
            {/* Opcion por defecto */}
            <div 
              onClick={() => handleSelect('', '-- Tratamiento Nuevo (Sin continuidad) --')}
              className={`px-4 py-3 rounded-xl cursor-pointer text-sm font-bold flex items-center justify-between transition-colors ${
                !value ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span>-- Tratamiento Nuevo (Sin continuidad) --</span>
              {!value && <CheckCircle2 size={16} className="text-blue-500" />}
            </div>

            {/* Sugerencias Automáticas */}
            {historialTratamientos && historialTratamientos.length > 0 && (
              <>
                <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <History size={12} /> Sugerencias Recientes
                </div>
                {historialTratamientos.map(historial => {
                  const isSelected = String(value) === String(historial.id_orden_servicio);
                  const label = `${historial.nombre_servicio} (Ingreso: ${historial.id_ingreso} - Fecha: ${historial.fecha_ingreso})`;
                  return (
                    <div 
                      key={historial.id_orden_servicio}
                      onClick={() => handleSelect(historial.id_orden_servicio, label)}
                      className={`px-4 py-3 rounded-xl cursor-pointer text-sm font-bold flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="truncate">{label}</span>
                      {isSelected && <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0" />}
                    </div>
                  );
                })}
              </>
            )}
            
            {/* Separador */}
            <div className="h-px bg-gray-100 my-2"></div>

            {/* Búsqueda Avanzada */}
            <div 
              onClick={() => {
                setIsOpen(false);
                setShowModal(true);
              }}
              className="px-4 py-3 rounded-xl cursor-pointer text-sm font-black text-[#2563EB] hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors"
            >
              <Search size={16} />
              Buscar más...
            </div>
          </div>
        </div>
      )}

      {/* Modal Búsqueda Avanzada */}
      <ModalBusquedaContinuidad
        abierto={showModal}
        onCerrar={() => setShowModal(false)}
        idPaciente={idPaciente}
        idServicio={idServicio}
        onSeleccionar={(id, label) => handleSelect(id, label)}
      />
    </div>
  );
}
