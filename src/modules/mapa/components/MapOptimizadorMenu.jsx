import React from 'react';
import { useMapaStore, MENU_IDS } from '../store/mapaStore';
import { useOptimizarRutasQuery } from '../queries/useOptimizarRutasQuery';
import { 
  X, MapPin, Power, Zap,
  TrendingUp, Sparkles, Layers, Calendar, ChevronLeft, ChevronRight, LayoutGrid
} from 'lucide-react';

export default function MapOptimizadorMenu() {
  const { 
    isMapSidebarOpen,
    activeMenuId,
    setActiveMenu,
    optimizadorFilters,
    setOptimizadorFilters,
    toggleBloqueOptimizador,
    mostrarOptimizador,
    toggleOptimizadorMenu
  } = useMapaStore();

  const isMenuOpen = activeMenuId === MENU_IDS.OPTIMIZADOR;

  const { data: routesResult, isLoading, isError } = useOptimizarRutasQuery();
  
  const visits = routesResult?.data || [];

  // Extraer bloques únicos de los datos para el selector
  const availableBlocks = [...new Set(visits.map(v => v.bloque_ruta))].sort((a, b) => parseInt(a) - parseInt(b));

  if (!isMenuOpen) return null;

  const handleMesChange = (increment) => {
    let newMes = optimizadorFilters.mes + increment;
    let newAnio = optimizadorFilters.anio;

    if (newMes > 12) {
      newMes = 1;
      newAnio++;
    } else if (newMes < 1) {
      newMes = 12;
      newAnio--;
    }

    setOptimizadorFilters({ mes: newMes, anio: newAnio });
  };

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div 
      className={`absolute top-20 bottom-0 w-98 bg-[#F9FAFB] shadow-2xl z-[390] transition-all duration-300 flex flex-col border-l border-gray-100 ${
        isMapSidebarOpen ? 'left-80' : 'left-0'
      }`}
    >
      {/* Header */}
      <div className={`px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Zap size={20} className="text-amber-500" />
            Optimizador Proyectado
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Frecuencia y Cercanía</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setActiveMenu(null)}
            title="Cerrar panel"
            className="text-gray-400 hover:text-amber-500 transition-colors p-2 rounded-xl hover:bg-amber-50"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Configuration Area */}
      <div className={`p-6 bg-white border-b border-gray-100 space-y-5 transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        
        {/* Selector de Mes/Año */}
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-2xl border border-gray-100">
           <button 
            onClick={() => handleMesChange(-1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-amber-500"
           >
             <ChevronLeft size={20} />
           </button>
           
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Periodo a Optimizar</span>
              <span className="text-sm font-black text-gray-900 uppercase">{meses[optimizadorFilters.mes - 1]} {optimizadorFilters.anio}</span>
           </div>

           <button 
            onClick={() => handleMesChange(1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-amber-500"
           >
             <ChevronRight size={20} />
           </button>
        </div>

        {/* Tipo de Filtro */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setOptimizadorFilters({ tipo_filtro: 'pacientes' })}
              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                optimizadorFilters.tipo_filtro === 'pacientes' 
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Pacientes
            </button>
            <button 
              onClick={() => setOptimizadorFilters({ tipo_filtro: 'profesional' })}
              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                optimizadorFilters.tipo_filtro === 'profesional' 
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Profesional
            </button>
        </div>

        {/* Mode Toggle Button */}
        <button
          onClick={toggleOptimizadorMenu}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase text-xs shadow-lg ${
            mostrarOptimizador 
              ? 'bg-red-500 text-white shadow-red-500/20' 
              : 'bg-amber-500 text-white shadow-amber-500/20'
          }`}
        >
          {mostrarOptimizador ? <Power size={18} /> : <Sparkles size={18} />}
          {mostrarOptimizador ? 'Desactivar Capa' : 'Generar Optimización'}
        </button>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            {visits.length} Visitas Proyectadas
          </span>
          {isLoading && <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100">
            Error al consultar el optimizador proyectado
          </div>
        )}

        <div className="space-y-3">
          {visits.length === 0 && !isLoading && (
            <div className="py-12 text-center opacity-30 select-none">
              <Zap size={48} className="mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest">Inicie la optimización proyectada</p>
            </div>
          )}

          {/* Agrupar y Filtrar por bloques */}
          {Object.entries(
            visits
              .filter(v => optimizadorFilters.bloques.length === 0 || optimizadorFilters.bloques.includes(String(v.bloque_ruta)))
              .reduce((acc, v) => {
              const block = v.bloque_ruta || 'Sin Bloque';
              if (!acc[block]) acc[block] = [];
              acc[block].push(v);
              return acc;
            }, {})
          ).sort(([a],[b]) => parseInt(a) - parseInt(b)).map(([block, blockVisits]) => (
            <div key={block} className="space-y-2 mb-6">
              <div className="flex items-center gap-3 px-1 mt-4 mb-2">
                <div className="h-[2px] bg-amber-100 flex-1"></div>
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                  <Layers size={12} className="text-amber-600" />
                  <span className="text-[10px] font-black text-amber-700 uppercase">Bloque {block}</span>
                </div>
                <div className="h-[2px] bg-amber-100 flex-1"></div>
              </div>

              {blockVisits.map((v, idx) => (
                <div key={`${v.id_paciente}-${idx}`} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group border-l-4 border-l-amber-500">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gray-50 text-gray-600 font-black text-[10px]">
                      #{v.orden_en_ruta}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-gray-900 uppercase leading-tight">{v.paciente}</h4>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase mt-1">
                        <MapPin size={10} />
                        <span className="truncate max-w-[180px]">ID: {v.id_paciente}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Selector de Bloques */}
      {availableBlocks.length > 0 && (
        <div className="absolute left-full top-10 w-48 max-h-[75vh] bg-white/95 backdrop-blur-md shadow-2xl border border-l-0 border-gray-100 rounded-r-3xl flex flex-col p-4 gap-4 animate-in slide-in-from-left-2 duration-500">
          <div className="flex items-center gap-2 opacity-30 ml-1 flex-shrink-0">
            <Layers size={14} className="text-gray-500" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Bloques de Ruta</span>
          </div>

          <div className="flex flex-col gap-3 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOptimizadorFilters({ bloques: [] });
              }}
              className={`w-full py-2.5 rounded-xl flex-shrink-0 flex items-center justify-center gap-2 transition-all duration-300 font-black text-[10px] uppercase border ${
                optimizadorFilters.bloques.length === 0
                  ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-500/20'
                  : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:text-amber-600'
              }`}
            >
              <LayoutGrid size={14} />
              Todos
            </button>

            <div className="overflow-y-auto custom-scrollbar pr-1 pb-2">
              <div className="grid grid-cols-4 gap-2">
                {availableBlocks.map((b) => (
                  <button
                    key={b}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBloqueOptimizador(String(b));
                    }}
                    className={`h-9 rounded-lg flex flex-col items-center justify-center transition-all duration-300 border ${
                      optimizadorFilters.bloques.includes(String(b))
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20 scale-105'
                        : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:text-amber-600'
                    }`}
                  >
                    <span className="text-[12px] font-black leading-none">{b}</span>
                    <span className="text-[6px] font-black uppercase opacity-60">B</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
