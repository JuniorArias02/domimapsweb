import React, { useState, useRef, useEffect } from 'react';
import { useMapaStore } from '../store/mapaStore';
import { useRutasOptimizadasQuery } from '../queries/useRutasOptimizadasQuery';
import { usePersonalQuery } from '../../personal/queries/usePersonalQuery';
import { 
  X, Search, Filter, 
  MapPin, Minimize2, Power, Calendar, User,
  ChevronDown, Check, TrendingUp, Sparkles, AlertCircle
} from 'lucide-react';

export default function MapRutasOptimizadasMenu() {
  const { 
    isMapSidebarOpen,
    isRutasOptimizadasMenuOpen,
    toggleRutasOptimizadasMenu,
    rutasOptimizadasFilters,
    setRutasOptimizadasFilters,
    mostrarRutasOptimizadas,
    setMostrarRutasOptimizadas
  } = useMapaStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const { data: routesResult, isLoading, isError } = useRutasOptimizadasQuery();
  const { data: personalResult, isLoading: isLoadingPersonal } = usePersonalQuery();
  
  const visits = routesResult?.data || [];
  const personalList = personalResult?.data || [];

  const filteredPersonal = personalList.filter(p => 
    p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id_personal.toString().includes(searchTerm)
  );

  const profesionalSeleccionado = personalList.find(p => String(p.id_personal) === String(rutasOptimizadasFilters.id_personal));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProfessional = (personal) => {
    setRutasOptimizadasFilters({ id_personal: personal.id_personal });
    setIsDropdownOpen(false);
    setSearchTerm('');
    // Al seleccionar profesional, si la capa no está activa, la activamos automáticamente
    if (!mostrarRutasOptimizadas) setMostrarRutasOptimizadas(true);
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const months = [
    { id: 1, name: 'Enero' }, { id: 2, name: 'Febrero' }, { id: 3, name: 'Marzo' },
    { id: 4, name: 'Abril' }, { id: 5, name: 'Mayo' }, { id: 6, name: 'Junio' },
    { id: 7, name: 'Julio' }, { id: 8, name: 'Agosto' }, { id: 9, name: 'Septiembre' },
    { id: 10, name: 'Octubre' }, { id: 11, name: 'Noviembre' }, { id: 12, name: 'Diciembre' }
  ];

  if (!isRutasOptimizadasMenuOpen) return null;

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
            <TrendingUp size={20} className="text-[#3B82F6]" />
            Rutas Optimizadas
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Planificación con Inteligencia</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleRutasOptimizadasMenu}
            title="Cerrar panel"
            className="text-gray-400 hover:text-[#3B82F6] transition-colors p-2 rounded-xl hover:bg-blue-50"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Configuration Area */}
      <div className={`p-6 bg-white border-b border-gray-100 space-y-5 transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        
        {/* Professional Select */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Profesional Asignado</label>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full text-[13px] font-black p-3.5 pl-11 pr-10 bg-gray-50 border border-gray-100 rounded-2xl focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:bg-white focus-within:border-blue-500 transition-all text-gray-700 cursor-pointer hover:border-gray-200 flex items-center min-h-[50px] outline-none"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={18} />
            </div>
            <span className={`truncate ${profesionalSeleccionado ? 'text-gray-900' : 'text-gray-400'}`}>
              {profesionalSeleccionado?.nombre_completo || 'Seleccionar profesional...'}
            </span>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[500] max-h-64 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-[12px] font-bold p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {isLoadingPersonal ? (
                  <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div></div>
                ) : filteredPersonal.map((p) => (
                  <div 
                    key={p.id_personal}
                    onClick={() => handleSelectProfessional(p)}
                    className={`p-3 px-4 flex items-center justify-between cursor-pointer transition-all hover:bg-blue-50 ${String(rutasOptimizadasFilters.id_personal) === String(p.id_personal) ? 'bg-blue-50/50' : ''}`}
                  >
                    <span className="text-[12px] font-black uppercase text-gray-700">{p.nombre_completo}</span>
                    {String(rutasOptimizadasFilters.id_personal) === String(p.id_personal) && <Check size={16} className="text-blue-500" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Month and Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Mes</label>
            <select 
              value={rutasOptimizadasFilters.mes}
              onChange={(e) => setRutasOptimizadasFilters({ mes: parseInt(e.target.value) })}
              className="w-full text-[13px] font-black p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-gray-700 cursor-pointer"
            >
              {months.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Año</label>
            <select 
              value={rutasOptimizadasFilters.anio}
              onChange={(e) => setRutasOptimizadasFilters({ anio: parseInt(e.target.value) })}
              className="w-full text-[13px] font-black p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-gray-700 cursor-pointer"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Mode Toggle Button */}
        <button
          onClick={() => setMostrarRutasOptimizadas(!mostrarRutasOptimizadas)}
          disabled={!rutasOptimizadasFilters.id_personal}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase text-xs shadow-lg ${
            !rutasOptimizadasFilters.id_personal 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
              : mostrarRutasOptimizadas 
                ? 'bg-red-500 text-white shadow-red-500/20' 
                : 'bg-[#2563EB] text-white shadow-blue-500/20'
          }`}
        >
          {mostrarRutasOptimizadas ? <Power size={18} /> : <Sparkles size={18} />}
          {mostrarRutasOptimizadas ? 'Desactivar Capa' : 'Generar Rutas en Mapa'}
        </button>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            {visits.length} Visitas Proyectadas
          </span>
          {isLoading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100">
            Error al consultar el optimizador
          </div>
        )}

        <div className="space-y-3">
          {visits.length === 0 && !isLoading && (
            <div className="py-12 text-center opacity-30 select-none">
              <Sparkles size={48} className="mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest">Inicie la optimización</p>
            </div>
          )}

          {/* Agrupar por fecha */}
          {Object.entries(
            visits.reduce((acc, v) => {
              const date = v.fecha_proyectada.split(' ')[0];
              if (!acc[date]) acc[date] = [];
              acc[date].push(v);
              return acc;
            }, {})
          ).sort().map(([date, dayVisits]) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-3 px-1 mt-4 mb-2">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase">{date}</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>

              {dayVisits.map((v) => (
                <div key={v.id_orden} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group border-l-4 border-l-[#2563EB]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-blue-50 text-blue-600 font-black text-xs">
                      {v.orden_visita}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-gray-900 uppercase leading-tight">{v.nombre_paciente}</h4>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase mt-1">
                        <MapPin size={10} />
                        <span className="truncate max-w-[180px]">{v.direccion}</span>
                      </div>
                      {v.observaciones_optimizacion && (
                        <div className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 animate-pulse">
                          <AlertCircle size={10} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">{v.observaciones_optimizacion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {dayVisits.length > 8 && (
                <div className="mx-auto text-[8px] font-black text-red-400 uppercase tracking-widest bg-red-50 py-1 px-3 rounded-full w-fit">
                   Sobrecarga: {dayVisits.length} visitas (Máx 8 recomendadas)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
