import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  User,
  Hash,
  Activity,
  FileCheck,
  FileText,
  Building2
} from 'lucide-react';
import { usePacientesRegistroQuery } from '../queries/usePacientesRegistroQuery';

export default function RegistroProgramaPage() {
  const navigate = useNavigate();
  
  // State for filters
  const [params, setParams] = useState({
    pagina: 1,
    por_pagina: 10,
    nombre_completo: '',
    identificacion: '',
    ingreso: '',
    autorizacion: ''
  });

  // Query
  const { data, isLoading, isError, isFetching } = usePacientesRegistroQuery(params);
  const pacientes = data?.data || [];
  const meta = data?.meta || { pagina_actual: 1, ultima_pagina: 1, total: 0 };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value, pagina: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.ultima_pagina) {
      setParams(prev => ({ ...prev, pagina: newPage }));
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Registro al Programa</h1>
          <p className="text-gray-500 font-medium">Consulta y gestiona los pacientes activos en el programa.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/registro-programa/autorizaciones')}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-[#2563EB] px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 text-sm uppercase tracking-wider shadow-sm"
          >
            <FileCheck size={18} />
            Autorizaciones
          </button>
          <button 
            onClick={() => navigate('/registro-programa/nuevo')}
            className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm uppercase tracking-wider"
          >
            <Plus size={18} />
            Nuevo
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            name="nombre_completo"
            placeholder="Paciente..."
            value={params.nombre_completo}
            onChange={handleFilterChange}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl text-sm font-medium transition-all"
          />
        </div>
        <div className="relative">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            name="identificacion"
            placeholder="Identificación..."
            value={params.identificacion}
            onChange={handleFilterChange}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl text-sm font-medium transition-all"
          />
        </div>
        <div className="relative">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            name="ingreso"
            placeholder="Ingreso..."
            value={params.ingreso}
            onChange={handleFilterChange}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl text-sm font-medium transition-all"
          />
        </div>
        <div className="relative">
          <FileCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            name="autorizacion"
            placeholder="Autorización..."
            value={params.autorizacion}
            onChange={handleFilterChange}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl text-sm font-medium transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
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
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><Hash size={12}/> ID</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><User size={12}/> Nombre Completo</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><Hash size={12}/> Identificación</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><Activity size={12}/> Edad</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><FileText size={12}/> Régimen</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><div className="flex items-center gap-2"><Building2 size={12}/> Aseguradora</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pacientes.length > 0 ? (
                pacientes.map((paciente) => (
                  <tr key={paciente.id_paciente} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-xl">#{paciente.id_paciente}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-gray-900 leading-tight">{paciente.nombre_completo}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-600">{paciente.identificacion}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-600">{paciente.edad} años</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                        paciente.regimen === 'S' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {paciente.regimen === 'S' ? 'Subsidiado' : 'Contributivo'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-tight">{paciente.nombre_aseguradora}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => navigate(`/registro-programa/paciente/${paciente.id_paciente}/autorizaciones`, { state: { paciente } })}
                        className="inline-flex items-center gap-2 bg-white hover:bg-gray-900 hover:text-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 group/btn"
                      >
                        <FileCheck size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Autorizaciones
                      </button>
                    </td>
                  </tr>
                ))
              ) : !isLoading && !isError && (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <User size={48} className="mb-4 text-gray-300" />
                      <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest">No se encontraron resultados</h4>
                      <p className="text-sm font-medium text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan="7" className="py-20 text-center text-red-500 font-bold">
                    Error al cargar los datos de pacientes del programa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-auto p-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Página {meta.pagina_actual} de {meta.ultima_pagina}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled={meta.pagina_actual === 1}
              onClick={() => handlePageChange(meta.pagina_actual - 1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-900 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={meta.pagina_actual === meta.ultima_pagina}
              onClick={() => handlePageChange(meta.pagina_actual + 1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-900 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}