import React from 'react';
import { useMapaStore } from '../store/mapaStore';
import { useMapaPacientesQuery } from '../queries/useMapaPacientesQuery';
import { useZonasQuery } from '../queries/useZonasQuery';
import { useComunasPorZonaQuery } from '../queries/useComunasPorZonaQuery';
import { useAseguradorasQuery } from '../queries/useAseguradorasQuery';
import { 
  X, Search, Filter, ChevronLeft, ChevronRight, 
  User, MapPin, Minimize2, Power, Globe, ChevronDown, Shield 
} from 'lucide-react';

export default function MapPacientesMenu() {
  const { 
    isMapSidebarOpen,
    mostrarPacientes,
    isPacientesMenuOpen, 
    setPacientesMenuOpen,
    pacientesFilters,
    setPacientesFilters,
    setPacientesPage,
    seleccionarPaciente,
    toggleMostrarPacientes 
  } = useMapaStore();

  const { data, isLoading, isError } = useMapaPacientesQuery();
  const { data: zonasData, isLoading: loadingZonas } = useZonasQuery();
  const { data: comunasData, isLoading: loadingComunas } = useComunasPorZonaQuery(pacientesFilters.id_zona);
  const { data: aseguradorasData, isLoading: loadingAseguradoras } = useAseguradorasQuery();
  
  const zonas = zonasData?.data || [];
  const comunas = comunasData?.data || [];
  const aseguradoras = aseguradorasData?.data || [];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'id_zona') {
      setPacientesFilters({ 
        [name]: value,
        id_comuna: '' 
      });
    } else {
      setPacientesFilters({ [name]: value });
    }
  };

  if (!mostrarPacientes) return null;

  return (
    <div 
      className={`absolute top-20 bottom-0 w-85 bg-[#F9FAFB] shadow-2xl z-[390] transition-all duration-300 flex flex-col border-l border-gray-100 ${
        isMapSidebarOpen ? 'left-80' : 'left-0'
      } ${
        isPacientesMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Viñeta para volver a abrir cuando está cerrado */}
      <button
        onClick={() => setPacientesMenuOpen(true)}
        className={`absolute top-24 w-10 h-14 bg-white border border-gray-200 border-l-0 rounded-r-xl shadow-md flex items-center justify-center text-gray-400 hover:text-[#2563EB] hover:bg-gray-50 focus:outline-none transition-all duration-300 ${
          isPacientesMenuOpen ? 'opacity-0 -right-5 pointer-events-none' : 'opacity-100 -right-10'
        }`}
        title="Filtros de Pacientes"
      >
        <Filter size={20} />
      </button>

      {/* Header */}
      <div className={`px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <User size={20} className="text-[#2563EB]" />
            Pacientes
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Búsqueda Geográfica</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setPacientesMenuOpen(false)}
            title="Minimizar panel"
            className="text-gray-400 hover:text-[#2563EB] transition-colors p-2 rounded-xl hover:bg-blue-50"
          >
            <Minimize2 size={18} />
          </button>
          <button 
            onClick={toggleMostrarPacientes}
            title="Desactivar capa de pacientes"
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
          >
            <Power size={18} />
          </button>
        </div>
      </div>

      {/* Modern Search & Filters Area */}
      <div className={`p-6 bg-white border-b border-gray-100 space-y-5 transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        {/* Status Filter Grid */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Estado del Paciente</label>
          <div className="grid grid-cols-3 gap-2 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
            <button
              onClick={() => setPacientesFilters({ estado: '' })}
              className={`py-2 px-1 rounded-xl text-[9px] font-black uppercase transition-all ${
                pacientesFilters.estado === '' 
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Todos
            </button>
            {[
              { id: 'ACTIVO', color: 'text-blue-600', activeBg: 'bg-blue-50' },
              { id: 'FALLECIDO', color: 'text-red-600', activeBg: 'bg-red-50' }
            ].map((status) => (
              <button
                key={status.id}
                onClick={() => setPacientesFilters({ estado: status.id })}
                className={`py-2 px-1 rounded-xl text-[9px] font-black uppercase transition-all ${
                  pacientesFilters.estado === status.id 
                    ? `bg-white ${status.color} shadow-sm border border-gray-100` 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {status.id}
              </button>
            ))}
          </div>
        </div>


        <div className="space-y-4">
          <div className="relative">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Zona Geográfica</label>
            <div className="relative group">
              <select 
                name="id_zona"
                value={pacientesFilters.id_zona || ''}
                onChange={handleFilterChange}
                className="w-full text-[13px] font-black flex items-center p-3.5 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all text-gray-700 appearance-none cursor-pointer hover:border-gray-200"
              >
                <option value="">Todas las Zonas</option>
                {zonas.map((zona) => (
                  <option key={zona.id_zona} value={zona.id_zona}>
                    {zona.nombre}
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB] group-focus-within:scale-110 transition-transform">
                <Globe size={18} />
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                <ChevronDown size={18} />
              </div>
              {loadingZonas && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                   <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Comuna / Sector</label>
            <div className="relative group">
              <select 
                name="id_comuna"
                value={pacientesFilters.id_comuna || ''}
                onChange={handleFilterChange}
                disabled={!pacientesFilters.id_zona}
                className={`w-full text-[13px] font-black p-3.5 pl-11 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all text-gray-700 appearance-none cursor-pointer hover:border-gray-200 ${
                  !pacientesFilters.id_zona ? 'bg-gray-100 border-gray-100 opacity-50 cursor-not-allowed' : 'bg-gray-50 border-gray-100'
                }`}
              >
                <option value="">{pacientesFilters.id_zona ? 'Todas las Comunas' : 'Seleccione una Zona'}</option>
                {comunas.map((comuna) => (
                  <option key={comuna.id_comuna} value={comuna.id_comuna}>
                    {comuna.nombre}
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#16A34A] group-focus-within:scale-110 transition-transform">
                <MapPin size={18} />
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                <ChevronDown size={18} />
              </div>
              {loadingComunas && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                   <div className="w-3.5 h-3.5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Aseguradora</label>
            <div className="relative group">
              <select 
                name="id_aseguradora"
                value={pacientesFilters.id_aseguradora || ''}
                onChange={handleFilterChange}
                className="w-full text-[13px] font-black p-3.5 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all text-gray-700 appearance-none cursor-pointer hover:border-gray-200"
              >
                <option value="">Todas las Aseguradoras</option>
                {aseguradoras.map((entidad) => (
                  <option key={entidad.id_aseguradora} value={entidad.id_aseguradora}>
                    {entidad.nombre}
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 group-focus-within:scale-110 transition-transform">
                <Shield size={18} />
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                <ChevronDown size={18} />
              </div>
              {loadingAseguradoras && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                   <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
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
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-bold text-blue-500">Cargando</span>
            </div>
          )}
        </div>

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-xs font-bold border border-red-100">
            Error al sincronizar datos
          </div>
        )}

        {!isLoading && !isError && data?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <Search size={48} className="text-gray-300 mb-3" />
            <p className="text-xs font-bold text-gray-500 px-10 leading-relaxed uppercase tracking-tighter">No encontramos pacientes con estos filtros</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {data?.data?.map((paciente) => (
            <div 
              key={paciente.id_paciente} 
              onClick={() => seleccionarPaciente(paciente.id_paciente)}
              className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${
                  paciente.estado === 'ACTIVO' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  <User size={20} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-[12px] font-black text-gray-900 group-hover:text-[#2563EB] transition-colors uppercase leading-[1.3] line-clamp-2 mb-1.5">
                    {paciente.nombre_completo}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                      paciente.estado === 'ACTIVO' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {paciente.estado}
                    </span>
                    {(paciente.latitud && paciente.longitud) ? (
                      <span className="flex items-center gap-1 text-[9px] font-black text-blue-500 uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        Geolocalizado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] font-black text-orange-400 uppercase">
                        <MapPin size={8} /> Sin Coordenadas
                      </span>
                    )}
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
            disabled={pacientesFilters.page <= 1}
            onClick={() => setPacientesPage(pacientesFilters.page - 1)}
            className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Página</p>
            <p className="text-sm font-black text-gray-900 leading-none">
              {pacientesFilters.page} <span className="text-gray-300 mx-1">/</span> {data.last_page}
            </p>
          </div>

          <button 
            disabled={pacientesFilters.page >= data.last_page}
            onClick={() => setPacientesPage(pacientesFilters.page + 1)}
            className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
