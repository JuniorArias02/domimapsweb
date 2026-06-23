import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Hash, 
  Calendar, 
  FileCheck, 
  User, 
  Building2, 
  Clipboard,
  ExternalLink,
  ShieldCheck,
  Plus,
  Eye,
  CalendarPlus
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAutorizacionesPacienteQuery, useCrearAutorizacionPacienteMutation } from '../queries/useAutorizacionesPacienteQuery';
import { usePacienteDetalleQuery } from '../../pacientes/queries/usePacientesQuery';
import OrdenMedicaModal from '../components/OrdenMedicaModal';
import RegistroAutorizacionModal from '../components/RegistroAutorizacionModal';

export default function AutorizacionPacientePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const pacienteDesdeState = location.state?.paciente;

  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');

  // Modal State for Medical Orders
  const [modalOrdenesAbierto, setModalOrdenesAbierto] = useState(false);
  const [idIngresoSeleccionado, setIdIngresoSeleccionado] = useState(null);

  const abrirModalOrdenes = (idIngreso) => {
    setIdIngresoSeleccionado(idIngreso);
    setModalOrdenesAbierto(true);
  };

  // Modal State for New Authorization Form
  const [modalFormAbierto, setModalFormAbierto] = useState(false);

  // Queries & Mutations
  const { data: pacienteData, isLoading: isLoadingPaciente } = usePacienteDetalleQuery(id);
  const { data: autorizacionesData, isLoading: isLoadingAutorizaciones, isError, isFetching } = useAutorizacionesPacienteQuery(id);
  const crearMutation = useCrearAutorizacionPacienteMutation(id);

  const manejarGuardarAutorizacion = async (datos) => {
    try {
      await crearMutation.mutateAsync({ ...datos, id_paciente: id });
      setModalFormAbierto(false);
      
      Swal.fire({
        title: '¡Registro Exitoso!',
        text: 'La autorización y sus servicios se han guardado de manera correcta.',
        icon: 'success',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
          confirmButton: 'bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
        },
        buttonsStyling: false
      });
    } catch (err) {
      console.error("Error al guardar autorización:", err);
      
      Swal.fire({
        title: 'Error al Registrar',
        text: err?.response?.data?.error || err?.response?.data?.message || 'Ocurrió un error inesperado al procesar la solicitud.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        customClass: {
          popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
          confirmButton: 'bg-[#EF4444] hover:bg-[#DC2626] text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
        },
        buttonsStyling: false
      });
    }
  };

  const paciente = pacienteDesdeState || pacienteData?.data || pacienteData || null;
  const autorizaciones = autorizacionesData?.data || [];
  
  const autorizacionesFiltradas = autorizaciones.filter(auth => {
    if (estadoFiltro === 'TODOS') return true;
    return auth.estado === estadoFiltro;
  });

  const mostrarCargandoPaciente = !paciente && isLoadingPaciente;
  const nombreAseguradora = paciente?.aseguradora?.nombre || paciente?.nombre_aseguradora;

  const formatRegimen = (reg) => {
    if (!reg) return '';
    if (reg === 'S') return 'Subsidiado';
    if (reg === 'C') return 'Contributivo';
    return reg;
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'No registrada';
    try {
      const date = new Date(fechaStr);
      // Evitar que la fecha sea inválida
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

  const copiarAlPortapapeles = (texto) => {
    navigator.clipboard.writeText(texto);
    // Podría integrarse un toast, pero por simplicidad mostramos un alert o lógica nativa silenciosa
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Botón de volver y Nueva Autorización */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate('/RegistroAlPrograma')}
          className="group inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-900 text-gray-600 hover:text-gray-900 px-5 py-2.5 rounded-2xl font-bold transition-all active:scale-95 text-xs uppercase tracking-wider shadow-sm"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al Registro
        </button>
        <button
          onClick={() => setModalFormAbierto(true)}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-xs uppercase tracking-wider"
        >
          <Plus size={16} />
          Nueva Autorización
        </button>
      </div>

      {/* Cabecera / Info del Paciente */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-50 text-[#2563EB] rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm">
            {paciente?.nombre_completo
              ? paciente.nombre_completo.split(' ').filter(n => n.length > 0).slice(0, 2).map(n => n[0].toUpperCase()).join('')
              : 'UP'
            }
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                {mostrarCargandoPaciente ? 'Cargando paciente...' : (paciente?.nombre_completo || 'Paciente no identificado')}
              </h1>
              {paciente?.estado && (
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                  paciente.estado === 'ACTIVO' 
                    ? 'bg-green-50 text-green-700 border-green-100' 
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {paciente.estado}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 font-medium">
              {paciente?.identificacion && (
                <span className="flex items-center gap-1">
                  <Hash size={14} className="text-gray-400" />
                  Identificación: <strong className="text-gray-700 font-bold">{paciente.tipo_documento ? `${paciente.tipo_documento} ` : ''}{paciente.identificacion}</strong>
                </span>
              )}
              {nombreAseguradora && (
                <span className="flex items-center gap-1">
                  <Building2 size={14} className="text-gray-400" />
                  Aseguradora: <strong className="text-gray-700 font-bold uppercase">{nombreAseguradora}</strong>
                </span>
              )}
              {paciente?.regimen && (
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-gray-400" />
                  Régimen: <strong className="text-gray-700 font-bold">{formatRegimen(paciente.regimen)}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Resumen rápido */}
        <div className="flex items-center gap-4 bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:self-stretch">
          <div className="text-center px-4">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Autorizaciones</span>
            <span className="text-3xl font-black text-[#2563EB]">{autorizaciones.length}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between px-2 gap-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {isLoadingAutorizaciones ? 'Consultando autorizaciones...' : `${autorizacionesFiltradas.length} registros asociados`}
        </div>
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 transition-all uppercase tracking-wider cursor-pointer"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="VIGENTE">Vigente</option>
          <option value="SUSPENDIDA">Suspendida</option>
          <option value="VENCIDA">Vencida</option>
          <option value="FINALIZADA">Finalizada</option>
        </select>
      </div>

      {/* Tabla de Autorizaciones */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px] flex flex-col relative">
        {/* Loading Overlay */}
        {(isLoadingAutorizaciones || isFetching) && (
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
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Hash size={12} />
                    Ingreso
                  </div>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    Fecha Ingreso
                  </div>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <FileCheck size={12} />
                    Número Autorización
                  </div>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={12} />
                    Estado
                  </div>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {autorizacionesFiltradas.length > 0 ? (
                autorizacionesFiltradas.map((auth, index) => (
                  <tr key={index} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-xl">
                        #{auth.ingreso}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-gray-600">
                        {formatFecha(auth.fecha_ingreso)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-[#2563EB] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50">
                        {auth.autorizacion || "sin estado"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                        auth.estado === 'VIGENTE' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : auth.estado === 'SUSPENDIDA'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : auth.estado === 'VENCIDA'
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : auth.estado === 'FINALIZADA'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-gray-50 text-gray-700 border-gray-100'
                      }`}>
                        {auth.estado}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => {
                            if (auth.autorizacion) {
                              navigate('/agendamiento/nueva-dos', { state: { autorizacion: auth.autorizacion, id_paciente: id } });
                            } else {
                              Swal.fire({
                                title: 'Sin Autorización',
                                text: 'Este registro no tiene un código de autorización válido.',
                                icon: 'warning'
                              });
                            }
                          }}
                          className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                          title="Programar Visita"
                        >
                          <CalendarPlus size={16} />
                        </button>
                        <button 
                          onClick={() => abrirModalOrdenes(auth.ingreso)}
                          className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all active:scale-90"
                          title="Ver Órdenes Médicas"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : !isLoadingAutorizaciones && !isError && (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <FileCheck size={48} className="mb-4 text-gray-300" />
                      <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest">Sin Autorizaciones</h4>
                      <p className="text-sm font-medium text-gray-500">Este paciente no registra autorizaciones activas</p>
                    </div>
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan="5" className="py-24 text-center text-red-500 font-bold">
                    Ocurrió un error al obtener las autorizaciones del paciente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrdenMedicaModal
        abierto={modalOrdenesAbierto}
        onCerrar={() => setModalOrdenesAbierto(false)}
        idIngreso={idIngresoSeleccionado}
      />

      <RegistroAutorizacionModal
        abierto={modalFormAbierto}
        onCerrar={() => setModalFormAbierto(false)}
        onGuardar={manejarGuardarAutorizacion}
        paciente={paciente}
        cargando={crearMutation.isPending}
      />
    </div>
  );
}
