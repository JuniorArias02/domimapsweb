import React from 'react';
import { X, FileText, Activity, Calendar, User, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useOrdenesMedicasQuery } from '../queries/useOrdenesMedicasQuery';

export default function OrdenesMedicasModal({ abierto, onCerrar, idIngreso }) {
  const { data: respuesta, isLoading, isError } = useOrdenesMedicasQuery(idIngreso);
  
  // Manejar si la data viene en .data o es el objeto directo (siendo defensivos)
  const ordenes = Array.isArray(respuesta) ? respuesta : (respuesta?.data || []);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCerrar} />

      <div className="relative w-full max-w-4xl bg-[#F9FAFB] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase">Órdenes Médicas</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Detalle de servicios asignados - Ingreso #{idIngreso}
              </p>
            </div>
          </div>
          <button onClick={onCerrar} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Consultando órdenes...</p>
            </div>
          ) : isError ? (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h3 className="text-red-900 font-bold">Error al cargar datos</h3>
              <p className="text-red-600 text-sm">No pudimos obtener las órdenes médicas en este momento.</p>
            </div>
          ) : ordenes.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-bold">Sin órdenes registradas</h3>
              <p className="text-gray-500 text-sm">No se encontraron órdenes médicas para este ingreso.</p>
            </div>
          ) : (
            ordenes.map((orden) => (
              <div key={orden.id_orden} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Info de la Orden */}
                <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Orden #{orden.id_orden}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-bold">
                      <Calendar size={14} className="text-blue-500" />
                      {orden.fecha_orden}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      orden.estado === 'VIGENTE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {orden.estado}
                    </span>
                  </div>
                </div>

                {/* Servicios de la Orden */}
                <div className="p-5">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-blue-500" /> Servicios Autorizados
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {orden.servicios?.map((srv) => (
                      <div key={srv.id_orden_servicio} className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white hover:border-blue-100 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-tight mb-0.5">
                              Cód: {srv.servicio?.codigo_servicio}
                            </p>
                            <h5 className="text-sm font-bold text-gray-900 leading-tight">
                              {srv.servicio?.nombre_servicio}
                            </h5>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-lg border border-gray-100">
                                <Clock size={12} /> {srv.numero_sesiones} Sesiones
                              </span>
                              {srv.frecuencia_dias && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-lg border border-gray-100">
                                  Cada {srv.frecuencia_dias} días
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm min-w-[200px]">
                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <User size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Profesional Asignado</p>
                            <p className="text-xs font-bold text-gray-700">ID: {srv.id_profesional_asignado}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {orden.observacion && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Observaciones</p>
                      <p className="text-xs text-amber-800 font-medium">{orden.observacion}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-100 flex justify-end sticky bottom-0">
          <button 
            onClick={onCerrar} 
            className="px-8 py-2.5 bg-gray-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
