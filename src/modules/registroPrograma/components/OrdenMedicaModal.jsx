import React from 'react';
import { 
  X, 
  FileText, 
  Activity, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  CalendarCheck,
  Check
} from 'lucide-react';
import { useOrdenMedicaQuery } from '../queries/useOrdenMedicaQuery';

export default function OrdenMedicaModal({ abierto, onCerrar, idIngreso }) {
  // Query to fetch medical orders for the admission
  const { data: respuesta, isLoading, isError } = useOrdenMedicaQuery(idIngreso);
  
  const ordenes = Array.isArray(respuesta) ? respuesta : (respuesta?.data || []);

  if (!abierto) return null;

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'No registrada';
    try {
      const date = new Date(fechaStr.replace(' ', 'T'));
      if (isNaN(date.getTime())) return fechaStr;

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      return fechaStr;
    }
  };

  const getVisitaBadgeStyles = (estado) => {
    switch (estado) {
      case 'COMPLETADA':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'PROGRAMADA':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'CANCELADA':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCerrar} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#F9FAFB] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-2xl flex items-center justify-center shadow-sm">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase">Órdenes Médicas del Ingreso</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Detalle de servicios y visitas - Ingreso #{idIngreso}
              </p>
            </div>
          </div>
          <button 
            onClick={onCerrar} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin mb-4" />
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest animate-pulse">Cargando órdenes médicas...</p>
            </div>
          ) : isError ? (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h3 className="text-red-900 font-bold">Error al cargar datos</h3>
              <p className="text-red-600 text-sm">No pudimos obtener la orden médica en este momento.</p>
            </div>
          ) : ordenes.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-bold">Sin órdenes registradas</h3>
              <p className="text-gray-500 text-sm">No se encontraron órdenes médicas para este ingreso.</p>
            </div>
          ) : (
            ordenes.map((orden) => (
              <div key={orden.id_orden} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Cabecera de la Orden */}
                <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#2563EB] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Orden #{orden.id_orden}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-bold">
                      <Calendar size={14} className="text-blue-500" />
                      {orden.fecha_orden}
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${
                    orden.estado === 'VIGENTE' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {orden.estado}
                  </span>
                </div>

                {/* Servicios Autorizados */}
                <div className="p-5 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity size={14} className="text-[#2563EB]" /> Servicios Autorizados
                    </h4>

                    <div className="space-y-6">
                      {orden.servicios?.map((srv) => (
                        <div key={srv.id_orden_servicio} className="bg-gray-50/30 rounded-2xl p-4 border border-gray-100 space-y-4">
                          
                          {/* Info del Servicio */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                                <CheckCircle2 size={20} />
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-tight">
                                  Cód: {srv.servicio?.codigo_servicio}
                                </span>
                                <h5 className="text-sm font-bold text-gray-900 leading-tight">
                                  {srv.servicio?.nombre_servicio}
                                </h5>
                              </div>
                            </div>
                            
                            {/* Profesional asignado */}
                            {srv.profesional && (
                              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm min-w-[240px]">
                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                  <User size={16} />
                                </div>
                                <div className="flex-1">
                                  <span className="text-[9px] font-black text-gray-400 uppercase leading-none block mb-1">
                                    Profesional Asignado
                                  </span>
                                  <span className="text-xs font-black text-gray-800 uppercase block truncate">
                                    {srv.profesional.nombre_completo}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 font-bold text-gray-500 bg-white px-2.5 py-1 rounded-xl border border-gray-100">
                              <Clock size={12} className="text-blue-500" />
                              Sesiones Autorizadas: <strong className="text-gray-800 ml-0.5">{srv.numero_sesiones}</strong>
                            </span>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border uppercase tracking-wider ${
                              srv.estado === 'ACTIVO' 
                                ? 'bg-green-50 text-green-700 border-green-100' 
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              Servicio: {srv.estado}
                            </span>
                          </div>

                          {/* Sección de Visitas */}
                          {srv.visitas && srv.visitas.length > 0 && (
                            <div className="border-t border-gray-100 pt-4 space-y-2">
                              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                Historial de Visitas / Agendas ({srv.visitas.length})
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {srv.visitas.map((visita) => (
                                  <div 
                                    key={visita.id_visita} 
                                    className="bg-white p-3.5 rounded-xl border border-gray-100/80 flex items-center justify-between gap-3 shadow-xs hover:border-gray-200 transition-colors"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <CalendarCheck size={14} className="text-gray-400" />
                                        <span className="text-xs font-bold text-gray-700">
                                          {formatFecha(visita.fecha_programada)}
                                        </span>
                                      </div>
                                      {visita.fecha_realizada && (
                                        <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50/50 px-1.5 py-0.5 rounded w-fit">
                                          <Check size={10} /> Realizada: {formatFecha(visita.fecha_realizada)}
                                        </span>
                                      )}
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${getVisitaBadgeStyles(visita.estado)}`}>
                                      {visita.estado}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observaciones de la Orden */}
                  {orden.observacion && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">
                        Observaciones
                      </p>
                      <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        {orden.observacion}
                      </p>
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
            className="px-8 py-2.5 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
