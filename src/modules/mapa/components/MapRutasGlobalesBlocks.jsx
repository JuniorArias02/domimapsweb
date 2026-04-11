import React from 'react';
import { useMapaStore, MENU_IDS } from '../store/mapaStore';
import { useRutasGlobalesQuery } from '../queries/useRutasGlobalesQuery';
import { Layers, LayoutGrid } from 'lucide-react';

export default function MapRutasGlobalesBlocks() {
  const { 
    isMapSidebarOpen,
    activeMenuId,
    rutasGlobalesFilters,
    setRutasGlobalesFilters
  } = useMapaStore();

  const isMenuOpen = activeMenuId === MENU_IDS.OPTIMIZADOR_GLOBAL;
  const { data: routesResult } = useRutasGlobalesQuery();
  
  const visits = routesResult?.data || [];
  const availableBlocks = [...new Set(visits.map(v => v.bloque_ruta))].sort((a, b) => parseInt(a) - parseInt(b));

  if (!isMenuOpen || availableBlocks.length === 0) return null;

  // Calculamos la posición horizontal: 
  // Sidebar Principal (320px) + Menú Global (392px) = 712px
  const leftPosition = isMapSidebarOpen ? 'left-[712px]' : 'left-[392px]';

  return (
    <div 
      className={`absolute top-24 bottom-24 w-16 bg-white/80 backdrop-blur-md shadow-xl z-[380] transition-all duration-500 flex flex-col items-center py-6 border border-gray-100 rounded-r-3xl ${leftPosition} animate-in fade-in slide-in-from-left-5`}
    >
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Indicador de sección */}
        <div className="flex flex-col items-center gap-1 opacity-40">
          <Layers size={14} className="text-gray-500" />
          <span className="text-[8px] font-black uppercase tracking-tighter">BKS</span>
        </div>

        <div className="flex flex-col gap-3 w-full px-2">
          {/* Botón TODOS */}
          <button
            onClick={() => setRutasGlobalesFilters({ bloque: 'TODOS' })}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group relative ${
              rutasGlobalesFilters.bloque === 'TODOS'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-md border border-transparent hover:border-blue-100'
            }`}
          >
            <LayoutGrid size={20} />
            <span className="absolute left-14 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-black">TODOS</span>
          </button>

          {/* Separador sutil */}
          <div className="h-px bg-gray-100 w-8 mx-auto my-1" />

          {/* Lista de Bloques */}
          {availableBlocks.map((b) => (
            <button
              key={b}
              onClick={() => setRutasGlobalesFilters({ bloque: b })}
              className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group relative ${
                rutasGlobalesFilters.bloque === b
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                  : 'bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 border border-transparent hover:border-blue-100'
              }`}
            >
              <span className="text-[14px] font-black leading-none">{b}</span>
              <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">B</span>
              
              <span className="absolute left-14 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-black whitespace-nowrap">BLOQUE {b}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
