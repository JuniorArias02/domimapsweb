import React, { useState } from 'react';
import { X, Search, Loader2, Hash, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import { useBuscarContinuidadAvanzadaMutation } from '../../agendamiento/queries/useAgendasQuery';

export default function ModalBusquedaContinuidad({ abierto, onCerrar, idPaciente, idServicio, onSeleccionar }) {
  const [numeroIngreso, setNumeroIngreso] = useState('');
  const [autorizacion, setAutorizacion] = useState('');
  const [mesInicio, setMesInicio] = useState('');
  const [mesFin, setMesFin] = useState('');

  const buscarMutation = useBuscarContinuidadAvanzadaMutation();

  if (!abierto) return null;

  const manejarBuscar = (e) => {
    e.preventDefault();
    buscarMutation.mutate({
      id_paciente: idPaciente,
      id_servicio: idServicio,
      numero_ingreso: numeroIngreso || undefined,
      autorizacion: autorizacion || undefined,
      mes_inicio: mesInicio || undefined,
      mes_fin: mesFin || undefined
    });
  };

  const resultados = buscarMutation.data || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCerrar} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Search size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 uppercase">Búsqueda Avanzada</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Encontrar historiales anteriores</p>
            </div>
          </div>
          <button onClick={onCerrar} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div 
            className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 space-y-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                manejarBuscar(e);
              }
            }}
          >
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Filtros de Búsqueda</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">N° Ingreso</label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={numeroIngreso}
                    onChange={(e) => setNumeroIngreso(e.target.value)}
                    placeholder="Ej: 1001"
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-bold bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Autorización</label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={autorizacion}
                    onChange={(e) => setAutorizacion(e.target.value)}
                    placeholder="Ej: AUTH-123"
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-bold bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Periodo (Rango)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="month"
                      value={mesInicio}
                      onChange={(e) => setMesInicio(e.target.value)}
                      title="Mes de inicio"
                      className="w-full pl-9 pr-2 py-2.5 text-sm font-bold bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-gray-600"
                    />
                  </div>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="month"
                      value={mesFin}
                      onChange={(e) => setMesFin(e.target.value)}
                      title="Mes de fin"
                      className="w-full pl-9 pr-2 py-2.5 text-sm font-bold bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-gray-600"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={manejarBuscar}
                disabled={buscarMutation.isPending}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {buscarMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Buscar
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Resultados</h3>
            
            {buscarMutation.isPending ? (
              <div className="py-10 flex flex-col items-center justify-center text-gray-400">
                <Loader2 size={32} className="animate-spin mb-3 text-blue-500" />
                <p className="text-sm font-bold">Buscando historiales...</p>
              </div>
            ) : buscarMutation.isSuccess && resultados.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <p className="text-sm font-bold text-gray-500">No se encontraron historiales con esos filtros.</p>
              </div>
            ) : resultados.length > 0 ? (
              <div className="grid gap-3 max-h-60 overflow-y-auto pr-2">
                {resultados.map(historial => {
                  const label = `${historial.nombre_servicio} (Ingreso: ${historial.id_ingreso} - Fecha: ${historial.fecha_ingreso})`;
                  return (
                    <div 
                      key={historial.id_orden_servicio}
                      onClick={() => {
                        onSeleccionar(historial.id_orden_servicio, label);
                        onCerrar();
                      }}
                      className="group p-4 bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-700">{historial.nombre_servicio}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs font-bold text-gray-500">
                          <span className="flex items-center gap-1"><Hash size={12} /> Ing: {historial.id_ingreso}</span>
                          {historial.autorizacion && <span className="flex items-center gap-1"><FileText size={12} /> {historial.autorizacion}</span>}
                          <span className="flex items-center gap-1"><Calendar size={12} /> {historial.fecha_ingreso}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400 text-sm font-bold">
                Usa los filtros superiores para buscar historiales más antiguos.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
