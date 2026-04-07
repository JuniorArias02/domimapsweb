import React, { useState, useRef, useEffect } from 'react';
import { useMapaStore } from '../store/mapaStore';
import { useRutasVisitasQuery } from '../queries/useRutasVisitasQuery';
import { usePersonalQuery } from '../../personal/queries/usePersonalQuery';
import { 
  X, Search, Filter, ChevronLeft, ChevronRight, 
  BriefcaseMedical, MapPin, Minimize2, Power, Calendar, User,
  ChevronDown, Check
} from 'lucide-react';

export default function MapProfesionalesMenu() {
  const { 
    isMapSidebarOpen,
    mostrarProfesionales,
    isProfesionalesMenuOpen, 
    setProfesionalesMenuOpen,
    profesionalesFilters,
    setProfesionalesFilters,
    setProfesionalesPage,
    toggleMostrarProfesionales 
  } = useMapaStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const { data: queryResult, isLoading, isError } = useRutasVisitasQuery();
  const { data: personalResult, isLoading: isLoadingPersonal } = usePersonalQuery();
  
  const data = queryResult || { data: [], total: 0, last_page: 1 };
  const personalList = personalResult?.data || [];

  // Filter personal by searchTerm
  const filteredPersonal = personalList.filter(p => 
    p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id_personal.toString().includes(searchTerm)
  );

  const profesionalSeleccionado = personalList.find(p => p.id_personal === profesionalesFilters.id_profesional);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setProfesionalesFilters({ [name]: value });
  };

  const handleSelectProfessional = (personal) => {
    setProfesionalesFilters({ id_profesional: personal.id_personal });
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  if (!mostrarProfesionales) return null;

  return (
    <div 
      className={`absolute top-20 bottom-0 w-85 bg-[#F9FAFB] shadow-2xl z-[390] transition-all duration-300 flex flex-col border-l border-gray-100 ${
        isMapSidebarOpen ? 'left-80' : 'left-0'
      } ${
        isProfesionalesMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Viñeta para volver a abrir cuando está cerrado */}
      <button
        onClick={() => setProfesionalesMenuOpen(true)}
        className={`absolute top-24 w-10 h-14 bg-white border border-gray-200 border-l-0 rounded-r-xl shadow-md flex items-center justify-center text-gray-400 hover:text-[#10B981] hover:bg-gray-50 focus:outline-none transition-all duration-300 ${
          isProfesionalesMenuOpen ? 'opacity-0 -right-5 pointer-events-none' : 'opacity-100 -right-10'
        }`}
        title="Filtros de Profesionales"
      >
        <Filter size={20} />
      </button>

      {/* Header */}
      <div className={`px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BriefcaseMedical size={20} className="text-[#10B981]" />
            Profesionales
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Gestión de Personal</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setProfesionalesMenuOpen(false)}
            title="Minimizar panel"
            className="text-gray-400 hover:text-[#10B981] transition-colors p-2 rounded-xl hover:bg-emerald-50"
          >
            <Minimize2 size={18} />
          </button>
          <button 
            onClick={toggleMostrarProfesionales}
            title="Desactivar capa de profesionales"
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
          >
            <Power size={18} />
          </button>
        </div>
      </div>

      {/* Modern Search & Filters Area */}
      <div className={`p-6 bg-white border-b border-gray-100 space-y-5 transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        
        {/* Searchable Select para Profesional */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center justify-between mb-2 ml-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase">Profesional en Misión</label>
            {profesionalesFilters.id_profesional && (
              <button 
                onClick={() => setProfesionalesFilters({ id_profesional: '' })}
                className="text-[9px] font-black text-red-500 uppercase hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>
          
          <div className="relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full text-[13px] font-black p-3.5 pl-11 pr-10 bg-gray-50 border border-gray-100 rounded-2xl focus-within:ring-4 focus-within:ring-emerald-500/5 focus-within:bg-white focus-within:border-emerald-500 transition-all text-gray-700 cursor-pointer hover:border-gray-200 flex items-center min-h-[50px] outline-none"
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
                    className="w-full text-[12px] font-bold p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-400"
                  />
                </div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {isLoadingPersonal ? (
                    <div className="p-8 text-center">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Cargando personal...</span>
                    </div>
                  ) : filteredPersonal.length > 0 ? (
                    filteredPersonal.map((p) => (
                      <div 
                        key={p.id_personal}
                        onClick={() => handleSelectProfessional(p)}
                        className={`p-3 px-4 flex items-center justify-between cursor-pointer transition-all hover:bg-emerald-50 group/item ${profesionalesFilters.id_profesional === p.id_personal ? 'bg-emerald-50/50' : ''}`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-[12px] font-black uppercase ${profesionalesFilters.id_profesional === p.id_personal ? 'text-emerald-600' : 'text-gray-700'} group-hover/item:text-emerald-700`}>
                            {p.nombre_completo}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">ID: {p.id_personal} | {p.tipo_documento}: {p.numero_documento || 'N/A'}</span>
                        </div>
                        {profesionalesFilters.id_profesional === p.id_personal && (
                          <Check size={16} className="text-emerald-500" />
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

        {/* Date Ranges (Atención) */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 -mb-2">Fechas de Atención (Rango)</label>
          <div className="grid grid-cols-2 gap-3">
            {/* Fecha A */}
            <div className="relative group mt-4">
              <div className="text-[9px] font-bold text-gray-400 uppercase mb-1 ml-1">Desde</div>
              <input 
                type="date"
                name="fecha_inicio"
                value={profesionalesFilters.fecha_inicio || ''}
                onChange={handleFilterChange}
                className="w-full text-[12px] font-black p-3 pl-9 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 transition-all text-gray-700 hover:border-gray-200"
              />
              <div className="absolute left-3 top-[28px] text-gray-400 group-focus-within:text-[#10B981] transition-colors pointer-events-none">
                <Calendar size={14} />
              </div>
            </div>

            {/* Fecha B */}
            <div className="relative group mt-4">
              <div className="text-[9px] font-bold text-gray-400 uppercase mb-1 ml-1">Hasta</div>
              <input 
                type="date"
                name="fecha_fin"
                value={profesionalesFilters.fecha_fin || ''}
                onChange={handleFilterChange}
                className="w-full text-[12px] font-black p-3 pl-9 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 transition-all text-gray-700 hover:border-gray-200"
              />
              <div className="absolute left-3 top-[28px] text-gray-400 group-focus-within:text-[#10B981] transition-colors pointer-events-none">
                <Calendar size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Resultados {data?.total ? `(${data.total})` : ''}
          </span>
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-bold text-emerald-500">Cargando</span>
            </div>
          )}
        </div>

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-xs font-bold border border-red-100">
            Error al consultar profesionales
          </div>
        )}

        {!isLoading && !isError && data?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <User size={48} className="text-gray-300 mb-3" />
            <p className="text-[10px] font-bold text-gray-500 px-10 leading-relaxed uppercase tracking-widest">
              {profesionalesFilters.id_profesional
                ? 'No encontramos rutas para este profesional'
                : 'Busque y seleccione un profesional para ver sus rutas'}
            </p>
          </div>
        )}

        {/* Mapeo de resultados para referencia */}
        <div className="flex flex-col gap-3">
          {data?.data?.map((visita) => (
            <div 
              key={visita.id_visita} 
              className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-emerald-50 text-emerald-600">
                  <span className="font-black text-sm">{visita.orden_visita}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-[11px] font-black text-gray-900 uppercase leading-[1.3] truncate mb-1">
                    {visita.nombre_paciente}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase">
                    <MapPin size={10} />
                    <span className="truncate">{visita.direccion}</span>
                  </div>
                  <div className="mt-2 text-[9px] font-black px-2 py-0.5 rounded-md uppercase bg-gray-50 inline-block text-gray-600 border border-gray-100">
                    Fecha: {visita.fecha_realizada}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Pagination */}
      {data?.last_page > 1 && (
        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
          <button 
            disabled={profesionalesFilters.page <= 1}
            onClick={() => setProfesionalesPage(profesionalesFilters.page - 1)}
            className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Página</p>
            <p className="text-sm font-black text-gray-900 leading-none">
              {profesionalesFilters.page} <span className="text-gray-300 mx-1">/</span> {data.last_page}
            </p>
          </div>

          <button 
            disabled={profesionalesFilters.page >= data.last_page}
            onClick={() => setProfesionalesPage(profesionalesFilters.page + 1)}
            className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
