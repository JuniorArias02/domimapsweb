import React from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  Calendar, 
  Hash,
  AlertCircle,
  Loader2,
  Eye
} from 'lucide-react';

const AutorizacionTable = ({ 
  autorizaciones, 
  isLoading, 
  onCrear, 
  onEditar, 
  onEliminar,
  onVerOrdenes
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando autorizaciones...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Listado de Autorizaciones</h2>
          <p className="text-sm text-gray-500">Historial de documentos autorizados para este paciente</p>
        </div>
        <button
          onClick={onCrear}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-blue-200 active:scale-95"
        >
          <Plus size={18} />
          Nueva Autorización
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <Hash size={14} />
                  Autorización
                </div>
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  Fecha Ingreso
                </div>
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <FileText size={14} />
                  Ingreso ID
                </div>
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {autorizaciones.length > 0 ? (
              autorizaciones.map((auth, index) => (
                <tr key={auth.ingreso || index} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {auth.autorizacion}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700">
                        {new Date(auth.fecha_ingreso).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium italic">
                        {new Date(auth.fecha_ingreso).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-500">
                      #{auth.ingreso}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onVerOrdenes(auth.id_ingreso || auth.ingreso)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Ver Órdenes Médicas"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditar(auth)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onEliminar(auth.id_ingreso)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-gray-900 font-bold">No hay autorizaciones</h3>
                    <p className="text-gray-500 text-sm">Este paciente aún no registra autorizaciones de ingreso.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutorizacionTable;
