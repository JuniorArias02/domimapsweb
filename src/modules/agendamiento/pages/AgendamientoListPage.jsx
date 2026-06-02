import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Filter,
  ClipboardList,
  User,
  Hash,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useAgendasQuery } from '../queries/useAgendasQuery';
import DetalleAgendamientoModal from '../components/DetalleAgendamientoModal';

export default function AgendamientoListPage() {
  const navigate = useNavigate();
  
  // State for filters
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    buscar: '',
    estado: ''
  });

  // Modal State
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Query
  const { data, isLoading, isError, isFetching } = useAgendasQuery(params);
  const agendas = data?.data || [];
  const meta = data?.meta || { current_page: 1, last_page: 1 };

  const handleSearchChange = (e) => {
    setParams(prev => ({ ...prev, buscar: e.target.value, page: 1 }));
  };

  const handleStatusChange = (e) => {
    setParams(prev => ({ ...prev, estado: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.last_page) {
      setParams(prev => ({ ...prev, page: newPage }));
    }
  };

  const openDetail = (agenda) => {
    setSelectedAgenda(agenda);
    setIsModalOpen(true);
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'No registrada';
    const [year, month, day] = fechaStr.split('T')[0].split(' ')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'VIGENTE': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'FINALIZADA': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'CANCELADA': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Agendamiento</h1>
          <p className="text-gray-500 font-medium">Gestiona y consulta las órdenes y servicios programados.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/agendamiento/nueva-dos')}
            className="flex items-center justify-center gap-2 bg-white border-2 border-[#2563EB] text-[#2563EB] hover:bg-blue-50 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 text-sm uppercase tracking-wider shadow-sm"
          >
            <Activity size={18} />
            Visita por Autorización
          </button>
          <button 
            onClick={() => navigate('/agendamiento/nueva')}
            className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm uppercase tracking-wider"
          >
            <Plus size={18} />
            Agendar
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por paciente o identificación..."
            value={params.buscar}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl text-sm font-medium transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select 
            value={params.estado}
            onChange={handleStatusChange}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl text-sm font-bold text-gray-700 transition-all appearance-none"
          >
            <option value="">TODOS LOS ESTADOS</option>
            <option value="VIGENTE">VIGENTE</option>
            <option value="FINALIZADA">FINALIZADA</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>
        </div>
        <div className="flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest px-4">
          {isLoading ? 'Cargando...' : `${meta.total || 0} resultados encontrados`}
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px] flex flex-col relative">
        {/* Loading Overlay */}
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Sincronizando</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><Hash size={12}/>ingreso</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><Calendar size={12}/> Fecha</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><User size={12}/> Paciente</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><ClipboardList size={12}/> Autorización</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><Activity size={12}/> Estado</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {agendas.length > 0 ? (
                agendas.map((agenda) => (
                  <tr key={agenda.id_orden} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-xl">#{agenda.ingreso}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-600">{formatFecha(agenda.fecha_orden)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 leading-tight">{agenda.nombre_paciente}</span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{agenda.identificacion}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50/50 px-3 py-1 rounded-xl border border-blue-100">{agenda.autorizacion}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(agenda.estado_orden)}`}>
                        {agenda.estado_orden}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => openDetail(agenda)}
                        className="inline-flex items-center gap-2 bg-white hover:bg-gray-900 hover:text-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 group/btn"
                      >
                        <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              ) : !isLoading && (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <ClipboardList size={48} className="mb-4 text-gray-300" />
                      <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest">No se encontraron resultados</h4>
                      <p className="text-sm font-medium text-gray-500">Intenta ajustar los filtros o términos de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-auto p-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Página {meta.current_page} de {meta.last_page}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled={meta.current_page === 1}
              onClick={() => handlePageChange(meta.current_page - 1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-900 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={meta.current_page === meta.last_page}
              onClick={() => handlePageChange(meta.current_page + 1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-900 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <DetalleAgendamientoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agenda={selectedAgenda}
      />
    </div>
  );
}
