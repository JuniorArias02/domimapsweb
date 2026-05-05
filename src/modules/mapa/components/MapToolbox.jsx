import React from 'react';
import { Ruler, X, MousePointer2, Building2, Wrench } from 'lucide-react';
import { useMapaStore, MENU_IDS } from '../store/mapaStore';

export default function MapToolbox() {
  const { 
    isRulerActive, 
    toggleRuler, 
    clearRuler, 
    activeMenuId, 
    toggleComunasMenu 
  } = useMapaStore();

  const isComunasActive = activeMenuId === MENU_IDS.COMUNAS;

  return (
    <div className="absolute bottom-10 right-8 z-[400] flex flex-col gap-3">
      {/* Caja contenedora visual para dar sensación de "Plugin" o "Toolbox" */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-2 shadow-2xl border border-gray-100/80 flex flex-col gap-2">
        
        {/* Cabecera minúscula del Toolbox */}
        <div className="flex items-center justify-center py-1">
          <Wrench size={12} className="text-gray-400" />
        </div>
        
        <div className="w-full h-px bg-gray-100 mb-1"></div>

        {/* Herramienta: Comunas */}
        <button
          onClick={toggleComunasMenu}
          title={isComunasActive ? 'Ocultar Sectores/Comunas' : 'Mostrar Sectores/Comunas'}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group ${
            isComunasActive 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
              : 'bg-transparent text-gray-500 hover:bg-purple-50 hover:text-purple-600'
          }`}
        >
          <Building2 size={22} className={`transition-transform duration-300 ${isComunasActive ? 'scale-110' : 'group-hover:scale-110'}`} />
          {isComunasActive && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 border-2 border-white"></span>
            </span>
          )}
        </button>

        {/* Herramienta: Regla de Medición */}
        <div className="relative flex flex-col gap-2">
          {/* Botón de Limpiar Regla (Solo aparece si hay puntos) */}
          {isRulerActive && (
            <button
              onClick={clearRuler}
              title="Borrar medición"
              className="absolute -left-14 top-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all animate-in slide-in-from-right-4 duration-300"
            >
              <X size={20} />
            </button>
          )}

          <button
            onClick={toggleRuler}
            title={isRulerActive ? 'Desactivar Regla' : 'Activar Regla (Medir Distancia)'}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group ${
              isRulerActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-transparent text-gray-500 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            {isRulerActive ? (
              <MousePointer2 size={22} className="animate-in zoom-in duration-300" />
            ) : (
              <Ruler size={22} className="transition-transform duration-300 group-hover:scale-110" />
            )}
            {isRulerActive && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white"></span>
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
