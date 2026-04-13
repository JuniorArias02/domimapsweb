import React from 'react';
import { useAgendas } from '../queries/useAgendas';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  User, 
  Stethoscope, 
  Calendar,
  Clock,
  Plus,
  Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Capa de UI (Presentation)
 * Vista de listado de agendas con diseño premium.
 */
export default function AgendaListPage() {
  const navigate = useNavigate();
  const { 
    data: response, 
    isLoading, 
    isError, 
    filters, 
    setFilters, 
    changePage, 
    changePerPage 
  } = useAgendas();

  const agendas = response?.data || [];
  const meta = response?.meta;

  const getStatusBadge = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'VIGENTE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'FINALIZADA':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CANCELADA':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Listado de Agendas</h1>
          <p className="text-gray-500 font-medium">Gestiona y consulta las órdenes programadas del sistema.</p>
        </div>
        <button 
          onClick={() => navigate('/agenda/nueva')}
          className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm uppercase tracking-wider"
        >
          <Plus size={18} />
          Nueva Agenda
        </button>
      </div>

      {/* Filters & Search Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB] transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o identificación..."
            value={filters.buscar}
            onChange={(e) => setFilters({ buscar: e.target.value })}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-[#2563EB]/30 focus:ring-4 focus:ring-[#2563EB]/5 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group w-full md:w-48">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB] transition-colors">
               <Filter size={18} />
             </div>
             <select
               value={filters.estado}
               onChange={(e) => setFilters({ estado: e.target.value })}
               className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-[#2563EB]/30 focus:ring-4 focus:ring-[#2563EB]/5 transition-all text-sm font-medium appearance-none cursor-pointer"
             >
               <option value="">Todos los Estados</option>
               <option value="VIGENTE">VIGENTE</option>
               <option value="FINALIZADA">FINALIZADA</option>
               <option value="CANCELADA">CANCELADA</option>
             </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest w-16">ID</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Paciente</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Especialidad</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Sesiones</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Fecha Orden</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-10">
                    <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                  </td>
                </tr>
              ))
            ) : agendas.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center opacity-30 select-none">
                    <Calendar size={64} className="mb-4 text-gray-400" />
                    <p className="text-xl font-black uppercase tracking-tight">No se encontraron agendas</p>
                    <p className="text-sm font-medium">Intenta ajustando los filtros de búsqueda</p>
                  </div>
                </td>
              </tr>
            ) : (
              agendas.map((agenda) => (
                <tr key={agenda.id_orden} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-5 font-bold text-gray-400 text-sm">#{agenda.id_orden}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase leading-tight line-clamp-1">{agenda.nombre_paciente}</p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase mt-0.5">{agenda.identificacion_paciente}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Stethoscope size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-700 uppercase">{agenda.nombre_especialidad}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-sm font-black text-gray-900">
                        <Hash size={14} className="text-gray-400" />
                        {agenda.numero_sesiones}
                      </span>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Cada {agenda.frecuencia_dias} días</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      {agenda.fecha_orden}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider ${getStatusBadge(agenda.estado)}`}>
                      {agenda.estado}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {meta && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 px-1">
          <div className="flex items-center gap-4 order-2 md:order-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Mostrando <span className="text-gray-900">{(meta.current_page - 1) * meta.per_page + 1} - {Math.min(meta.current_page * meta.per_page, meta.total)}</span> de <span className="text-gray-900">{meta.total}</span> registros
            </span>
            <div className="h-4 w-px bg-gray-200 hidden md:block" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Filas:</span>
              <select 
                value={filters.per_page}
                onChange={(e) => changePerPage(Number(e.target.value))}
                className="bg-transparent text-xs font-black text-gray-900 focus:outline-none cursor-pointer"
              >
                {[15, 30, 50, 100].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 order-1 md:order-2">
            <button 
              onClick={() => changePage(filters.page - 1)}
              disabled={filters.page === 1 || isLoading}
              className="p-2 rounded-xl border border-gray-100 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
              <span className="text-xs font-black text-gray-900 tracking-widest">
                PÁGINA {meta.current_page} <span className="text-gray-300 mx-2">/</span> {meta.last_page}
              </span>
            </div>

            <button 
              onClick={() => changePage(filters.page + 1)}
              disabled={meta.current_page === meta.last_page || isLoading}
              className="p-2 rounded-xl border border-gray-100 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

