import React from 'react';
import { ChevronLeft, Layers } from 'lucide-react';
import { useMapaStore } from '../store/mapaStore';
import { itemsMenuSidebar, COLOR_CONFIGS } from '../constants/menuSidebarMapa';

export default function MapSidebar() {
  const store = useMapaStore();
  const { isMapSidebarOpen, toggleMapSidebar } = store;

  return (
    <div
      className={`absolute top-0 bottom-0 left-0 w-80 bg-white shadow-2xl z-[400] transition-all duration-300 flex flex-col border-r border-gray-100 ${
        isMapSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Toggle Button (Google Maps Style) */}
      <button
        onClick={toggleMapSidebar}
        className="absolute -right-10 top-6 w-10 h-14 bg-white border border-gray-200 border-l-0 rounded-r-xl shadow-md flex items-center justify-center text-gray-400 hover:text-[#2563EB] hover:bg-gray-50 focus:outline-none transition-all group"
        title={isMapSidebarOpen ? "Cerrar opciones" : "Opciones del mapa"}
      >
        <div className="transition-transform duration-300 group-hover:scale-110">
          {isMapSidebarOpen ? <ChevronLeft size={24} /> : <Layers size={22} />}
        </div>
      </button>

      {/* Header Section */}
      <div className="px-7 py-6 border-b border-gray-50 bg-[#F9FAFB]/50">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Layers size={14} className="text-[#2563EB]" />
          </div>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
            Capas y Filtros
          </h2>
        </div>
        <h3 className="text-xl font-black text-gray-900 tracking-tight">Panel de Control</h3>
      </div>

      {/* Controls Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        <div className="space-y-4">

          {/* Section Label */}
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-3 mb-2">Visibilidad</p>

          {/* Iterated Controls */}
          {itemsMenuSidebar.map((item) => {
            const IconComponent = item.icono;
            const isActivo = store[item.storeKeyActivo];
            const toggleAction = store[item.storeKeyToggle];
            const colors = COLOR_CONFIGS[item.colorKey] || {};

            return (
              <div
                key={item.id}
                onClick={toggleAction}
                className={`flex items-center justify-between cursor-pointer group p-3.5 rounded-2xl border transition-all duration-300 ${
                  isActivo
                    ? colors.activeBg || 'bg-blue-50/50 border-blue-100 shadow-sm'
                    : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    isActivo
                      ? colors.activeIcon || 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 rotate-0'
                      : 'bg-gray-100 text-gray-400 rotate-[-10deg] group-hover:rotate-0 group-hover:bg-gray-200'
                  }`}>
                    <IconComponent size={22} />
                  </div>
                  <div>
                    <span className={`block text-sm font-black transition-colors ${
                      isActivo ? colors.activeText || 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {item.etiqueta}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium block mt-0.5 leading-none">
                      {item.descripcion}
                    </span>
                  </div>
                </div>

                {/* Custom Switch Indicator */}
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                  isActivo ? colors.activeSwitch || 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${
                    isActivo ? 'left-6' : 'left-1'
                  }`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
