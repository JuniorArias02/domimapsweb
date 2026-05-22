import React from 'react';
import { useMapaStore, MENU_IDS } from '../store/mapaStore';
import { useOptimizarRutasQuery } from '../queries/useOptimizarRutasQuery';
import { useServiciosQuery } from '../queries/useServiciosQuery';
import { 
  X, MapPin, Power, Zap,
  TrendingUp, Sparkles, Layers, Calendar, ChevronLeft, ChevronRight, LayoutGrid,
  ChevronDown, Activity
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
  const { data: serviciosData, isLoading: isLoadingServicios } = useServiciosQuery();
  
  const visits = routesResult?.data || [];
  const servicios = serviciosData?.data || serviciosData || [];

  
  const availableBlocks = [...new Set(visits.map(v => v.bloque_ruta))].sort((a, b) => parseInt(a) - parseInt(b));

  if (!isMenuOpen) return null;

  const currentDate = new Date();
  const currentMes = currentDate.getMonth() + 1;
  const currentAnio = currentDate.getFullYear();

  const isPastDisabled = optimizadorFilters.anio < currentAnio || 
    (optimizadorFilters.anio === currentAnio && optimizadorFilters.mes <= currentMes);

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

    if (newAnio < currentAnio || (newAnio === currentAnio && newMes < currentMes)) {
      return;
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
            disabled={isPastDisabled}
            className={`p-2 rounded-xl transition-all ${
              isPastDisabled 
                ? 'opacity-40 cursor-not-allowed text-gray-300' 
                : 'hover:bg-white hover:shadow-sm text-gray-400 hover:text-amber-500'
            }`}
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

        {/* Selector de Servicio */}
        <div className="relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Servicio Médico</label>
          <div className="relative group">
            <select
              name="id_servicio"
              value={optimizadorFilters.id_servicio || ''}
              onChange={(e) => setOptimizadorFilters({ id_servicio: e.target.value })}
              className="w-full text-[12px] font-black p-3.5 pl-11 pr-10 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all text-gray-700 appearance-none cursor-pointer hover:border-gray-200"
            >
              <option value="">Todos los Servicios</option>
              {servicios.map((serv) => (
                <option key={serv.id_servicio} value={serv.id_servicio}>
                  {serv.codigo_servicio} - {serv.nombre_servicio}
                </option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 group-focus-within:scale-110 transition-transform">
              <Activity size={18} />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
              <ChevronDown size={18} />
            </div>
            {isLoadingServicios && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Ver Agendados Switch */}
        <label className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/70 rounded-2xl border border-gray-100 cursor-pointer transition-all duration-200 group">
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-gray-800 uppercase tracking-wide">Ver Agendados</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Optimizar solo visitas programadas</span>
          </div>
          <div className="relative inline-flex items-center">
            <input 
              type="checkbox" 
              checked={optimizadorFilters.ver_agendados || false}
              onChange={(e) => setOptimizadorFilters({ ver_agendados: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </div>
        </label>

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
          ).sort(([a],[b]) => parseInt(a) - parseInt(b)).map(([block, blockVisits]) => {
            const getBlockColor = (blockNum) => {
              const colors = [
                { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: 'text-blue-600', line: 'bg-blue-100', leftBorder: 'border-l-blue-500' },
                { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', icon: 'text-green-600', line: 'bg-green-100', leftBorder: 'border-l-green-500' },
                { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: 'text-purple-600', line: 'bg-purple-100', leftBorder: 'border-l-purple-500' },
                { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', icon: 'text-pink-600', line: 'bg-pink-100', leftBorder: 'border-l-pink-500' },
                { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', icon: 'text-indigo-600', line: 'bg-indigo-100', leftBorder: 'border-l-indigo-500' },
                { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100', icon: 'text-teal-600', line: 'bg-teal-100', leftBorder: 'border-l-teal-500' },
                { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: 'text-rose-600', line: 'bg-rose-100', leftBorder: 'border-l-rose-500' },
                { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', icon: 'text-orange-600', line: 'bg-orange-100', leftBorder: 'border-l-orange-500' },
                { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100', icon: 'text-cyan-600', line: 'bg-cyan-100', leftBorder: 'border-l-cyan-500' },
                { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: 'text-emerald-600', line: 'bg-emerald-100', leftBorder: 'border-l-emerald-500' }
              ];
              const num = parseInt(blockNum);
              const index = isNaN(num) ? 0 : ((num - 1) % colors.length + colors.length) % colors.length;
              return colors[index];
            };
            const colors = getBlockColor(block);
            
            return (
            <div key={block} className="space-y-2 mb-6">
              <div className="flex items-center gap-3 px-1 mt-4 mb-2">
                <div className={`h-[2px] ${colors.line} flex-1`}></div>
                <div className={`flex items-center gap-2 ${colors.bg} px-3 py-1 rounded-full border ${colors.border} shadow-sm`}>
                  <Layers size={12} className={colors.icon} />
                  <span className={`text-[10px] font-black ${colors.text} uppercase`}>Bloque {block}</span>
                </div>
                <div className={`h-[2px] ${colors.line} flex-1`}></div>
              </div>

              {blockVisits.map((v, idx) => (
                <div key={`${v.id_paciente}-${idx}`} className={`bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group border-l-4 ${colors.leftBorder}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gray-50 text-gray-600 font-black text-[10px]">
                      #{v.orden_en_ruta}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[11px] font-black text-gray-900 uppercase leading-tight">{v.paciente}</h4>
                      <div className="flex flex-col gap-1 mt-1.5">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
                          <MapPin size={10} />
                          <span className="truncate">ID: {v.id_paciente}</span>
                        </div>
                        {v.fecha_programada && (
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase">
                            <Calendar size={10} />
                            <span>{new Date(v.fecha_programada).toLocaleString('es-CO', { 
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}</span>
                          </div>
                        )}
                        {optimizadorFilters.tipo_filtro === 'profesional' && v.nombre_profesional && (
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-500 uppercase">
                            <Sparkles size={10} />
                            <span className="truncate">{v.nombre_profesional}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            );
          })}
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
