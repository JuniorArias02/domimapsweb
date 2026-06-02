import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Search, User, Stethoscope, 
  Calendar, Save, ClipboardList, Info, 
  UserCheck, Hash, ShieldCheck, Activity, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import Swal from 'sweetalert2';

import { usePendientesPorAutorizacionQuery, useProgramarVisitaMutation } from '../queries/useAgendasQuery';
import { usePersonalBusqueda } from '../queries/useBusquedaQueries';
import AsyncSearchSelect from '../components/AsyncSearchSelect';

const CrearAgendamientoDos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const autorizacionInicial = location.state?.autorizacion || '';

  // Form State
  const [autorizacionBusqueda, setAutorizacionBusqueda] = useState(autorizacionInicial);
  const [autorizacionBuscada, setAutorizacionBuscada] = useState(autorizacionInicial);
  
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [profesional, setProfesional] = useState(null);
  const [fechaProgramada, setFechaProgramada] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Queries
  const { data: serviciosData, isLoading: isLoadingServicios, isError: isErrorServicios, error } = usePendientesPorAutorizacionQuery(autorizacionBuscada);
  const programarMutation = useProgramarVisitaMutation();
  
  const serviciosPendientes = serviciosData || [];

  const handleVolver = () => {
    if (location.state?.autorizacion) {
      navigate(-1);
    } else {
      navigate('/agendamiento');
    }
  };

  const handleBuscarAutorizacion = (e) => {
    e.preventDefault();
    if (autorizacionBusqueda.trim().length >= 3) {
      setAutorizacionBuscada(autorizacionBusqueda.trim());
      setServicioSeleccionado(null);
    }
  };

  const handleGuardar = async () => {
    if (!servicioSeleccionado || !profesional || !fechaProgramada) return;

    // Obtenemos el id_paciente del state (pasado desde la tabla) 
    // Si no está, intentamos extraerlo del servicio (por si el backend lo llegara a mandar)
    const idPaciente = location.state?.id_paciente || servicioSeleccionado.id_paciente;

    if (!idPaciente) {
      Swal.fire('Error', 'No se ha podido identificar el ID del paciente para esta visita. Intente acceder desde la ficha del paciente.', 'error');
      return;
    }

    const payload = {
      id_orden_servicio: servicioSeleccionado.id_orden_servicio,
      id_paciente: idPaciente,
      id_personal: profesional.id_personal,
      fecha_programada: fechaProgramada.replace('T', ' ') + ':00',
      estado: 'PROGRAMADA',
      observaciones: observaciones
    };

    try {
      await programarMutation.mutateAsync(payload);
      Swal.fire({
        title: '¡Visita Programada!',
        text: 'La visita se ha agendado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
          confirmButton: 'bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
        },
        buttonsStyling: false
      });
      handleVolver();
    } catch (err) {
      console.error('Error al programar:', err);
      Swal.fire({
        title: 'Error al agendar',
        text: err?.response?.data?.error || 'Ocurrió un error al intentar programar la visita.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        customClass: {
          popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
        },
        buttonsStyling: false
      });
    }
  };

  const renderPersonalOption = (item) => (
    <div>
      <p className="text-sm font-black text-gray-900 group-hover:text-[#2563EB]">{item.nombre_completo}</p>
      <p className="text-[10px] font-bold text-gray-400 mt-0.5">{item.tipo_documento}: {item.numero_documento}</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header Area */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleVolver}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-[#2563EB] hover:bg-blue-50 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Programar Visita <span className="text-[#2563EB]">por Autorización</span></h1>
          <p className="text-gray-500 font-medium">Búsqueda por código de autorización y validación de sesiones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA: BUSQUEDA Y OBSERVACIONES */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CARD: BUSQUEDA DE AUTORIZACION */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm relative overflow-visible z-30">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#2563EB] rounded-l-[2.5rem]"></div>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Search size={14} />
              Localizar por Autorización
            </h3>
            
            <form onSubmit={handleBuscarAutorizacion} className="relative">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2 ml-1">Código de Autorización</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Ej. A-123456"
                    value={autorizacionBusqueda}
                    onChange={(e) => setAutorizacionBusqueda(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:outline-none focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 rounded-2xl text-sm font-bold transition-all shadow-inner uppercase"
                  />
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button 
                  type="submit"
                  disabled={autorizacionBusqueda.trim().length < 3}
                  className="bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Info de estado de búsqueda */}
            {isLoadingServicios && (
              <div className="mt-6 flex items-center justify-center p-4 bg-blue-50/50 rounded-2xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Buscando servicios...</span>
                </div>
              </div>
            )}

            {isErrorServicios && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <p className="text-sm font-bold text-red-800">Error en la búsqueda</p>
                  <p className="text-xs text-red-600 mt-1">{error?.response?.data?.message || 'No se pudo obtener información.'}</p>
                </div>
              </div>
            )}

            {!isLoadingServicios && autorizacionBuscada && serviciosPendientes.length === 0 && !isErrorServicios && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                <Info className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <p className="text-sm font-bold text-amber-800">Sin servicios disponibles</p>
                  <p className="text-xs text-amber-600 mt-1">No se encontraron servicios con sesiones pendientes para esta autorización.</p>
                </div>
              </div>
            )}

            {!isLoadingServicios && serviciosPendientes.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
                <ShieldCheck className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <p className="text-sm font-bold text-green-800">Servicios Encontrados</p>
                  <p className="text-xs font-medium text-green-700 mt-1">Se encontraron {serviciosPendientes.length} servicios con cupo disponible.</p>
                </div>
              </div>
            )}
          </div>

          {/* OBSERVACIONES */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ClipboardList size={14} />
              Observaciones de la Visita
            </h3>
            <textarea
              rows={5}
              placeholder="Escribe aquí detalles adicionales para el profesional (Llamar al llegar, timbre dañado...)"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm font-medium resize-none"
            ></textarea>
          </div>
        </div>

        {/* COLUMNA DERECHA: SELECCION DE SERVICIO Y AGENDAMIENTO */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm relative z-20">
            <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2 mb-8">
              <Stethoscope size={24} className="text-[#2563EB]" />
              Detalles de la Visita
            </h3>

            {!autorizacionBuscada || serviciosPendientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed border-gray-100 rounded-[2rem]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Activity size={32} />
                </div>
                <div>
                  <p className="text-gray-400 font-bold">Busca una autorización para ver los servicios</p>
                  <p className="text-gray-300 text-xs mt-1">Solo se mostrarán servicios que tengan sesiones pendientes</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* SELECCION DE SERVICIO */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Servicio a Programar</label>
                    <div className="space-y-3">
                      {serviciosPendientes.map(srv => {
                        const isSelected = servicioSeleccionado?.id_orden_servicio === srv.id_orden_servicio;
                        return (
                          <div 
                            key={srv.id_orden_servicio}
                            onClick={() => setServicioSeleccionado(srv)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-[#2563EB] bg-blue-50 shadow-md transform scale-[1.01]' 
                                : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 rounded-full ${isSelected ? 'text-[#2563EB]' : 'text-gray-300'}`}>
                                  {isSelected ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
                                </div>
                                <div>
                                  <h4 className={`text-sm font-black ${isSelected ? 'text-[#2563EB]' : 'text-gray-900'}`}>
                                    {srv.servicio?.nombre_servicio || srv.servicio?.nombre || `Servicio #${srv.id_servicio}`}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                      <Hash size={12} className="text-gray-400"/>
                                      Orden: {srv.id_orden}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                      <Clock size={12} className="text-gray-400"/>
                                      Frecuencia: Cada {srv.frecuencia_dias} días
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* BADGES DE SESIONES */}
                              <div className="flex flex-col items-end gap-1.5">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                                  Total: {srv.numero_sesiones}
                                </span>
                                <span className="text-[11px] font-black uppercase tracking-wider bg-blue-100 text-[#2563EB] px-2.5 py-1 rounded-md border border-blue-200">
                                  Quedan: {srv.sesiones_pendientes}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* SELECCION DE PERSONAL Y FECHA */}
                {servicioSeleccionado && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Profesional / Personal</label>
                      <AsyncSearchSelect
                        useQueryHook={usePersonalBusqueda}
                        placeholder="Buscar profesional..."
                        onSelect={(item) => setProfesional(item)}
                        renderOption={renderPersonalOption}
                        valueDisplay={profesional ? `${profesional.nombre_completo} (${profesional.tipo_documento}: ${profesional.numero_documento})` : ''}
                        onClear={() => setProfesional(null)}
                        icon={UserCheck}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Fecha y Hora de la Visita</label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={fechaProgramada}
                          onChange={(e) => setFechaProgramada(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 focus:outline-none focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 rounded-2xl text-sm font-bold transition-all"
                        />
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB]" size={20} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 px-8 z-40 flex justify-end gap-4 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
        <button 
          onClick={handleVolver}
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm"
        >
          Cancelar
        </button>
        <button 
          disabled={!servicioSeleccionado || !profesional || !fechaProgramada || programarMutation.isLoading}
          className="flex items-center gap-2 px-8 py-3 bg-[#16A34A] text-white rounded-xl font-bold hover:bg-[#15803d] transition-all shadow-lg shadow-green-500/30 text-sm disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
          onClick={handleGuardar}
        >
          <Save size={18} />
          {programarMutation.isLoading ? 'Guardando...' : 'Programar Visita'}
        </button>
      </div>
    </div>
  );
};

export default CrearAgendamientoDos;

