import React from 'react';
import { 
  X, 
  User, 
  Calendar, 
  FileText, 
  MapPin, 
  Phone, 
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  Stethoscope
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    VIGENTE: 'bg-blue-50 text-blue-700 border-blue-100',
    COMPLETADA: 'bg-green-50 text-green-700 border-green-100',
    PROGRAMADA: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    CANCELADA: 'bg-red-50 text-red-700 border-red-100',
    ACTIVO: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  const currentStyle = styles[status] || 'bg-gray-50 text-gray-700 border-gray-100';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentStyle} uppercase tracking-wider`}>
      {status}
    </span>
  );
};

export default function DetalleAgendamientoModal({ isOpen, onClose, agenda }) {
  if (!isOpen || !agenda) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Detalle del ingreso #{agenda.ingreso}</h2>
              <p className="text-gray-500 text-sm font-medium">Creada el {agenda.fecha_orden}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Patient Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <User size={18} />
                <span className="font-bold text-sm uppercase tracking-wider">Información del Paciente</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">{agenda.nombre_paciente}</h3>
                <p className="text-gray-500 font-medium text-sm flex items-center gap-2 mt-1">
                  <FileText size={14} /> ID: {agenda.identificacion}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2 border-t border-gray-50">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-600 font-medium">{agenda.direccion}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600 font-medium">{agenda.telefono}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FileText size={18} />
                <span className="font-bold text-sm uppercase tracking-wider">Datos de Autorización</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Número de Autorización</label>
                  <p className="font-mono font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 inline-block">
                    {agenda.autorizacion}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Estado Orden</label>
                    <StatusBadge status={agenda.estado_orden} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Orders Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Stethoscope size={20} className="text-blue-600" />
              Servicios Autorizados
            </h3>

            {agenda.ordenes_servicios?.map((serv, sIdx) => (
              <div key={sIdx} className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-black text-gray-900 leading-tight mb-1">{serv.nombre_servicio}</h4>
                    <p className="text-sm text-gray-500 font-medium">Asignado a: <span className="text-blue-600">{serv.nombre_profesional}</span></p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-200">
                      SESIONES: {serv.numero_sesiones}
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-200">
                      FREQ: Cada {serv.frecuencia_dias} días
                    </div>
                    <StatusBadge status={serv.estado} />
                  </div>
                </div>

                <div className="p-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Cronograma de Visitas</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {serv.visitas_domiciliarias?.map((visita, vIdx) => (
                      <div key={vIdx} className="bg-gray-50/30 rounded-2xl p-4 border border-gray-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-gray-400">VISITA #{vIdx + 1}</span>
                          <StatusBadge status={visita.estado} />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                          <Calendar size={14} className="text-blue-500" />
                          {new Date(visita.fecha_programada).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                          <Clock size={14} />
                          {new Date(visita.fecha_programada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Observations */}
          {agenda.observacion && (
            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-3">
                <AlertCircle size={18} />
                <span className="font-bold text-sm uppercase tracking-wider">Observaciones de la Orden</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {agenda.observacion}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-gray-200 transition-all active:scale-95 text-sm uppercase tracking-wider"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
