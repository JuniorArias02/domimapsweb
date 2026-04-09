import React, { useState } from 'react';
import { useMapaStore } from '../store/mapaStore';
import { useTodoComunasQuery } from '../queries/useTodoComunasQuery';
import { usePacientesComunaQuery } from '../queries/usePacientesComunaQuery';
import { 
  Building2, Users, ChevronDown, MapPin, User, Search, RefreshCw, X, ChevronRight
} from 'lucide-react';

export default function MapPacientesComunaMenu() {
  const { 
    mostrarPacientes,
    tipoVistaPacientes,
    filtroComunaId,
    setFiltroComunaId,
    seleccionarPaciente,
    toggleMostrarPacientes,
    isMapSidebarOpen
  } = useMapaStore();

  const [isOpen, setIsOpen] = useState(true);

  // Queries
  const { data: comunasData, isLoading: loadingComunas } = useTodoComunasQuery();
  const { data: pacientesData, isLoading: loadingPacientes, isFetching: fetchingPacientes } = usePacientesComunaQuery(filtroComunaId);

  const comunas = comunasData?.data || [];
  const pacientes = pacientesData?.data || [];
  
  // Encontrar el nombre de la comuna seleccionada
  const selectedComunaName = comunas.find(c => String(c.id_comuna) === String(filtroComunaId))?.nombre || 'Seleccione Comuna';

  if (!mostrarPacientes || tipoVistaPacientes !== 'POR_COMUNA') return null;

  return (
    <div 
      className={`absolute top-20 bottom-0 w-85 bg-[#F9FAFB] shadow-2xl z-[390] transition-all duration-300 flex flex-col border-l border-gray-100 ${
        isMapSidebarOpen ? 'left-80' : 'left-0'
      } ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 size={20} className="text-[#2563EB]" />
            Pacientes por Comuna
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Filtro de Sector Específico</p>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-[#2563EB] p-2 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Selector de Comuna Premium */}
      <div className="p-6 bg-white border-b border-gray-100">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Seleccionar Sector</label>
        <div className="relative group">
          <select 
            value={filtroComunaId}
            onChange={(e) => setFiltroComunaId(e.target.value)}
            className="w-full text-[13px] font-black p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all text-gray-700 appearance-none cursor-pointer hover:border-gray-200"
          >
            <option value="">Seleccione una comuna...</option>
            {comunas.map((comuna) => (
              <option key={comuna.id_comuna} value={comuna.id_comuna}>
                {comuna.nombre}
              </option>
            ))}
          </select>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB]">
            <MapPin size={22} strokeWidth={2.5} />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
            <ChevronDown size={20} />
          </div>
          {loadingComunas && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Listado de Resultados */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#F9FAFB]/50">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            {filtroComunaId ? `Pacientes en ${selectedComunaName}` : 'Esperando selección'}
          </span>
          {(loadingPacientes || fetchingPacientes) && (
            <div className="flex items-center gap-2">
              <RefreshCw size={12} className="text-blue-500 animate-spin" />
              <span className="text-[10px] font-bold text-blue-500">Actualizando</span>
            </div>
          )}
        </div>

        {!filtroComunaId && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={40} className="text-gray-300" />
            </div>
            <p className="text-xs font-bold text-gray-500 px-10 leading-relaxed uppercase tracking-widest">Selecciona una comuna para cargar el censo</p>
          </div>
        )}

        {filtroComunaId && pacientes.length === 0 && !loadingPacientes && (
          <div className="bg-white border border-gray-100 p-8 rounded-3xl text-center shadow-sm">
             <Users size={40} className="mx-auto text-gray-200 mb-3" />
             <p className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">No hay pacientes geolocalizados en este sector</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {pacientes.map((paciente) => (
            <div 
              key={paciente.id_paciente}
              onClick={() => seleccionarPaciente(paciente.id_paciente)}
              className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex-shrink-0 flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300 shadow-inner">
                  <User size={22} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-[12px] font-black text-gray-900 group-hover:text-[#2563EB] transition-colors uppercase leading-tight line-clamp-2">
                    {paciente.nombre_completo}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-black text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      ID: {paciente.identificacion}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-black text-green-500 uppercase">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                       Activo
                    </span>
                  </div>
                </div>
                <div className="self-center text-gray-200 group-hover:text-blue-500 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Summary */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Sector</p>
            <p className="text-xl font-black text-gray-900 leading-none">{pacientes.length} <span className="text-xs text-gray-400">Pacientes</span></p>
          </div>
          <button 
            onClick={() => setFiltroComunaId('')}
            className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest underline underline-offset-4"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Overlay toggle slider button (visible when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-24 w-10 h-14 bg-white border border-gray-200 border-l-0 rounded-r-xl shadow-md flex items-center justify-center text-gray-400 hover:text-[#2563EB] hover:bg-gray-50 focus:outline-none transition-all -right-10"
        >
          <Building2 size={20} />
        </button>
      )}
    </div>
  );
}
