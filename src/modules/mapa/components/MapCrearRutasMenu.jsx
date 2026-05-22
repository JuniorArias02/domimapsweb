import React, { useState, useRef, useEffect } from 'react';
import { useMapaStore, MENU_IDS } from '../store/mapaStore';
import { useVisitasProgramadasQuery } from '../queries/useVisitasProgramadasQuery';
import { useServiciosQuery } from '../queries/useServiciosQuery';
import { usePersonalQuery } from '../../personal/queries/usePersonalQuery';
import { 
  X, Search, Filter, ChevronLeft, ChevronRight, 
  MapPin, Minimize2, Power, Calendar, User, Check,
  ChevronDown, Activity, Route, CheckSquare, Square
} from 'lucide-react';

export default function MapCrearRutasMenu() {
  const { 
    isMapSidebarOpen,
    mostrarCrearRutas,
    activeMenuId,
    setActiveMenu,
    crearRutasFilters,
    setCrearRutasFilters,
    toggleCrearRutasMenu,
    selectedVisitasIds,
    toggleSelectedVisita,
    clearSelectedVisitas,
    setSelectedVisitas
  } = useMapaStore();

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'No registrada';
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        const [year, month, day] = fechaStr.split('-');
        return `${day}/${month}/${year}`;
      }

      const date = new Date(fechaStr.replace(' ', 'T'));
      if (isNaN(date.getTime())) return fechaStr;

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      if (fechaStr.includes(' ') || fechaStr.includes('T')) {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        const hoursStr = String(hours).padStart(2, '0');
        return `${day}/${month}/${year} ${hoursStr}:${minutes} ${period}`;
      }
      return `${day}/${month}/${year}`;
    } catch (e) {
      return fechaStr;
    }
  };

  const isMenuOpen = activeMenuId === MENU_IDS.CREAR_RUTAS;
 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const { data: visitasResult, isLoading, isFetching, isError } = useVisitasProgramadasQuery();
  const { data: serviciosData, isLoading: isLoadingServicios } = useServiciosQuery();
  const { data: personalResult, isLoading: isLoadingPersonal } = usePersonalQuery();
  
  const visits = visitasResult?.data || [];
  const servicios = serviciosData?.data || serviciosData || [];
  const personalList = personalResult?.data || [];

  // Filter personal by searchTerm
  const filteredPersonal = personalList.filter(p => 
    p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id_personal.toString().includes(searchTerm)
  );

  const profesionalSeleccionado = personalList.find(p => String(p.id_personal) === String(crearRutasFilters.id_personal));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMesChange = (increment) => {
    let newMes = crearRutasFilters.mes + increment;
    let newAnio = crearRutasFilters.anio;

    if (newMes > 12) {
      newMes = 1;
      newAnio += 1;
    } else if (newMes < 1) {
      newMes = 12;
      newAnio -= 1;
    }

    setCrearRutasFilters({ mes: newMes, anio: newAnio });
  };

  const handleSelectProfessional = (personal) => {
    setCrearRutasFilters({ id_personal: personal.id_personal });
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const handleSelectAll = () => {
    const allIds = visits.map(v => v.id_visita);
    setSelectedVisitas(allIds);
  };

  const handleCreateRouteAction = () => {
    if (selectedVisitasIds.length === 0) return;
    alert(`Crear Ruta con ${selectedVisitasIds.length} visitas seleccionadas.\nEsta funcionalidad se encuentra en desarrollo.`);
  };

  if (!mostrarCrearRutas) return null;

  return (
    <div 
      className={`absolute top-20 bottom-0 w-98 bg-[#F9FAFB] shadow-2xl z-[390] transition-all duration-300 flex flex-col border-l border-gray-100 ${
        isMapSidebarOpen ? 'left-80' : 'left-0'
      } ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Tab toggle handle when minimized */}
      <button
        onClick={() => setActiveMenu(MENU_IDS.CREAR_RUTAS)}
        className={`absolute top-36 w-10 h-14 bg-white border border-gray-200 border-l-0 rounded-r-xl shadow-md flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all duration-300 ${
          isMenuOpen ? 'opacity-0 -right-5 pointer-events-none' : 'opacity-100 -right-10'
        }`}
        title="Creación de Rutas"
      >
        <Filter size={20} />
      </button>

      {/* Header */}
      <div className={`px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Route size={20} className="text-indigo-600" />
            Crear Rutas
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Visitas Programadas</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setActiveMenu(null)}
            title="Minimizar panel"
            className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-xl hover:bg-indigo-50"
          >
            <Minimize2 size={18} />
          </button>
          <button 
            onClick={toggleCrearRutasMenu}
            title="Desactivar capa de creación"
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
          >
            <Power size={18} />
          </button>
        </div>
      </div>

      {/* Filters Form Area */}
      <div className={`p-6 bg-white border-b border-gray-100 space-y-4 transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        
        {/* Date Selector */}
        <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
          <button 
            onClick={() => handleMesChange(-1)}
            className="p-2 hover:bg-white rounded-xl hover:shadow-sm text-gray-500 transition-all active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="text-center">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Periodo</span>
            <span className="text-xs font-black text-gray-800 uppercase">
              {new Date(crearRutasFilters.anio, crearRutasFilters.mes - 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <button 
            onClick={() => handleMesChange(1)}
            className="p-2 hover:bg-white rounded-xl hover:shadow-sm text-gray-500 transition-all active:scale-90"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Medical Service Selector */}
        <div className="relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Servicio Médico</label>
          <div className="relative group">
            <select
              name="id_servicio"
              value={crearRutasFilters.id_servicio || ''}
              onChange={(e) => setCrearRutasFilters({ id_servicio: e.target.value })}
              className="w-full text-[12px] font-black p-3.5 pl-11 pr-10 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all text-gray-700 appearance-none cursor-pointer hover:border-gray-200"
            >
              <option value="">Todos los Servicios</option>
              {servicios.map((serv) => (
                <option key={serv.id_servicio} value={serv.id_servicio}>
                  {serv.codigo_servicio} - {serv.nombre_servicio}
                </option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 group-focus-within:scale-110 transition-transform">
              <Activity size={18} />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
              <ChevronDown size={18} />
            </div>
            {isLoadingServicios && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Searchable Select for Professional */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center justify-between mb-2 ml-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase">Profesional Asignado</label>
            {crearRutasFilters.id_personal && (
              <button 
                onClick={() => setCrearRutasFilters({ id_personal: '' })}
                className="text-[9px] font-black text-red-500 uppercase hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>
          
          <div className="relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full text-[13px] font-black p-3.5 pl-11 pr-10 bg-gray-50 border border-gray-100 rounded-2xl focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:bg-white focus-within:border-indigo-500 transition-all text-gray-700 cursor-pointer hover:border-gray-200 flex items-center min-h-[50px] outline-none"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all">
                <Search size={18} />
              </div>
              <span className={`truncate ${profesionalSeleccionado ? 'text-gray-900' : 'text-gray-400'}`}>
                {profesionalSeleccionado?.nombre_completo || 'Buscar profesional...'}
              </span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all">
                <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[500] max-h-64 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Escriba nombre o documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-[12px] font-bold p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all placeholder-gray-400"
                  />
                </div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {isLoadingPersonal ? (
                    <div className="p-8 text-center">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Cargando personal...</span>
                    </div>
                  ) : filteredPersonal.length > 0 ? (
                    filteredPersonal.map((p) => (
                      <div 
                        key={p.id_personal}
                        onClick={() => handleSelectProfessional(p)}
                        className={`p-3 px-4 flex items-center justify-between cursor-pointer transition-all hover:bg-indigo-50 group/item ${String(crearRutasFilters.id_personal) === String(p.id_personal) ? 'bg-indigo-50/50' : ''}`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-[12px] font-black uppercase ${String(crearRutasFilters.id_personal) === String(p.id_personal) ? 'text-indigo-600' : 'text-gray-700'} group-hover/item:text-indigo-700`}>
                            {p.nombre_completo}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">ID: {p.id_personal} | {p.tipo_documento}: {p.numero_documento || 'N/A'}</span>
                        </div>
                        {String(crearRutasFilters.id_personal) === String(p.id_personal) && (
                          <Check size={16} className="text-indigo-500" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-[10px] font-bold uppercase italic tracking-widest leading-relaxed">
                      No se encontraron<br/>profesionales
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50/30">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Visitas Programadas {visits.length ? `(${visits.length})` : ''}
          </span>
          
          <div className="flex items-center gap-2">
            {(isLoading || isFetching) && (
              <div className="flex items-center gap-1.5 mr-2">
                <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[9px] font-black text-indigo-500 uppercase">Cargando</span>
              </div>
            )}
            
            {visits.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={handleSelectAll}
                  className="text-[9px] font-black text-indigo-600 hover:underline uppercase"
                >
                  Seleccionar Todo
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={clearSelectedVisitas}
                  className="text-[9px] font-black text-red-500 hover:underline uppercase"
                >
                  Limpiar Seleccion
                </button>
              </div>
            )}
          </div>
        </div>

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-xs font-bold border border-red-100">
            Error al consultar visitas programadas
          </div>
        )}

        {!isLoading && !isError && visits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <User size={48} className="text-gray-300 mb-3" />
            <p className="text-[10px] font-bold text-gray-500 px-10 leading-relaxed uppercase tracking-widest">
              No se encontraron visitas programadas para los filtros seleccionados
            </p>
          </div>
        )}

        {/* Visitas List */}
        <div className="flex flex-col gap-3">
          {visits.map((visita) => {
            const isSelected = selectedVisitasIds.includes(visita.id_visita);
            return (
              <div 
                key={visita.id_visita} 
                onClick={() => toggleSelectedVisita(visita.id_visita)}
                className={`bg-white border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/10' 
                    : 'border-gray-100 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 transition-colors ${isSelected ? 'text-indigo-600' : 'text-gray-300 group-hover:text-gray-400'}`}>
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-[11px] font-black text-gray-900 uppercase leading-[1.3] truncate mb-1">
                      {visita.paciente}
                    </h4>
                    
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase mt-0.5">
                      <MapPin size={10} className="text-gray-400" />
                      <span className="truncate">{visita.direccion}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                      <Activity size={10} className="text-gray-400" />
                      <span className="truncate">{visita.codigo_servicio} - {visita.nombre_servicio}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <span className="text-[8px] font-black uppercase text-gray-400">
                        Prof: <span className="text-gray-700 font-bold">{visita.nombre_profesional || 'Sin asignar'}</span>
                      </span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {formatFecha(visita.fecha_programada)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      {selectedVisitasIds.length > 0 && (
        <div className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleCreateRouteAction}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-black uppercase text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Route size={18} />
            Crear Ruta ({selectedVisitasIds.length} Seleccionados)
          </button>
        </div>
      )}
    </div>
  );
}
