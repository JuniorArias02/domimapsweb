import React from 'react';
import { useMapaStore } from '../store/mapaStore';
import { comunas } from '../constants/comunas';
import { 
  X, Building2, Eye, EyeOff, CheckSquare, Minimize2, Map as MapIcon, Power
} from 'lucide-react';

export default function MapComunasMenu() {
  const { 
    isMapSidebarOpen,
    isComunasMenuOpen, 
    toggleComunasMenu,
    selectedComunas,
    toggleComunaSelection,
    setComunasSelected,
    isDetalleSidebarOpen
  } = useMapaStore();

  if (!isComunasMenuOpen) return null;

  const allComunasIds = Object.keys(comunas);
  const isAllSelected = selectedComunas.length === allComunasIds.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setComunasSelected([]);
    } else {
      setComunasSelected(allComunasIds);
    }
  };

  return (
    <div 
      className={`absolute top-20 bottom-0 w-85 bg-[#F9FAFB] shadow-2xl z-[390] transition-all duration-300 flex flex-col border-l border-gray-100 right-0 ${
        isComunasMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header - Matching MapPacientesMenu style */}
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 size={20} className="text-[#2563EB]" />
            Comunas
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Delimitación Urbana</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleComunasMenu}
            title="Desactivar capa"
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
          >
            <Power size={18} />
          </button>
        </div>
      </div>

      {/* Global Actions Area */}
      <div className="p-6 bg-white border-b border-gray-100 transition-all duration-300">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Control Global</label>
        <button 
          onClick={handleToggleAll}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-black text-[12px] uppercase ${
            isAllSelected 
              ? 'bg-blue-50 border-blue-200 text-blue-600' 
              : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
          }`}
        >
          {isAllSelected ? (
            <>
              <EyeOff size={16} />
              Ocultar Todas
            </>
          ) : (
            <>
              <Eye size={16} />
              Mostrar Todas
            </>
          )}
        </button>
      </div>

      {/* Results List / Comunas Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Sectores Disponibles ({allComunasIds.length})
          </span>
          <div className="text-[10px] font-black text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50">
            {selectedComunas.length} Activas
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {Object.entries(comunas).map(([id, info]) => {
            const isSelected = selectedComunas.includes(id);
            
            return (
              <div 
                key={id}
                onClick={() => toggleComunaSelection(id)}
                className={`bg-white border p-4 rounded-2xl shadow-sm transition-all cursor-pointer group active:scale-[0.98] ${
                  isSelected ? 'border-blue-200 ring-2 ring-blue-500/5' : 'border-gray-100 hover:border-blue-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? 'shadow-md scale-100' : 'bg-gray-100 opacity-60 group-hover:opacity-100'
                    }`}
                    style={{ backgroundColor: isSelected ? info.color : undefined }}
                  >
                    <MapIcon size={20} className={isSelected ? 'text-white' : 'text-gray-400'} />
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <h4 className={`text-[13px] font-black tracking-tight transition-colors uppercase leading-[1.3] line-clamp-1 mb-1 ${
                      isSelected ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {info.nombre}
                    </h4>
                    <div className="flex items-center gap-2">
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                        isSelected 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'bg-gray-50 text-gray-400 border border-gray-100'
                      }`}>
                        {isSelected ? 'Activo' : 'Oculto'}
                      </span>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }}></div>
                    </div>
                  </div>

                  {/* Custom Checkbox UI */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 mt-1 transition-all ${
                    isSelected 
                      ? 'bg-[#2563EB] border-[#2563EB]' 
                      : 'bg-transparent border-gray-100 group-hover:border-gray-200'
                  }`}>
                    {isSelected && <CheckSquare size={14} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-gray-50 bg-[#F9FAFB]/30">
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">
            Visor Geográfico de Comunas
          </span>
        </div>
      </div>
    </div>
  );
}
