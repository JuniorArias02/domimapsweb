import React, { useState, useEffect } from 'react';
import { 
  X, 
  FilePlus, 
  Loader2, 
  Hash, 
  Calendar, 
  User, 
  FileText, 
  Users, 
  Activity, 
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import BuscadorProfesional from './BuscadorProfesional';
import BuscadorServicio from './BuscadorServicio';
import { useVerificarAutorizacionQuery } from '../queries/useVerificarAutorizacionQuery';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const parseFechaInicio = (fechaStr) => {
  if (!fechaStr) return { date: '', hour: '12', minute: '00', period: 'AM' };
  
  const [date, time] = fechaStr.split('T');
  if (!time) return { date: date || '', hour: '12', minute: '00', period: 'AM' };
  
  const [h24, min] = time.split(':');
  let h24Num = parseInt(h24, 10);
  if (isNaN(h24Num)) h24Num = 12;
  
  const period = h24Num >= 12 ? 'PM' : 'AM';
  let h12 = h24Num % 12;
  if (h12 === 0) h12 = 12;
  
  return {
    date: date || '',
    hour: String(h12),
    minute: min || '00',
    period
  };
};

const buildFechaInicio = (date, hour, minute, period) => {
  if (!date) return '';
  
  let h24 = parseInt(hour, 10);
  if (period === 'PM' && h24 < 12) h24 += 12;
  if (period === 'AM' && h24 === 12) h24 = 0;
  
  const h24Str = String(h24).padStart(2, '0');
  const minStr = String(minute).padStart(2, '0');
  
  return `${date}T${h24Str}:${minStr}`;
};

const SERVICIO_INICIAL = () => ({
  id_servicio: '',
  nombre_servicio: '',
  id_profesional: '',
  nombre_profesional: '',
  numero_sesiones: 1,
  frecuencia_dias: 1,
  fecha_inicio: new Date().toISOString().slice(0, 16),
});

export default function RegistroAutorizacionModal({ 
  abierto, 
  onCerrar, 
  onGuardar, 
  paciente, 
  cargando 
}) {
  const [autorizacion, setAutorizacion] = useState('');
  const [observacion, setObservacion] = useState('');
  const [servicios, setServicios] = useState([SERVICIO_INICIAL()]);
  
  const [erroresGenerales, setErroresGenerales] = useState({});
  const [erroresServicios, setErroresServicios] = useState([]);

  // Debounce para verificar autorización en tiempo real sin saturar el backend
  const debouncedAutorizacion = useDebounce(autorizacion, 2000);
  const { data: verifData, isLoading: verifLoading } = useVerificarAutorizacionQuery(debouncedAutorizacion);

  useEffect(() => {
    if (abierto) {
      setAutorizacion('');
      setObservacion('');
      setServicios([SERVICIO_INICIAL()]);
      setErroresGenerales({});
      setErroresServicios([]);
    }
  }, [abierto]);

  const agregarServicio = () => {
    setServicios(prev => [...prev, SERVICIO_INICIAL()]);
    setErroresServicios(prev => [...prev, {}]);
  };

  const eliminarServicio = (index) => {
    if (servicios.length > 1) {
      setServicios(prev => prev.filter((_, i) => i !== index));
      setErroresServicios(prev => prev.filter((_, i) => i !== index));
    }
  };

  const manejarCambioServicio = (index, e) => {
    const { name, value } = e.target;
    setServicios(prev => prev.map((s, i) => i === index ? { ...s, [name]: value } : s));
    
    // Limpiar error específico
    setErroresServicios(prev => {
      const nuevos = [...prev];
      if (nuevos[index] && nuevos[index][name]) {
        nuevos[index] = { ...nuevos[index], [name]: '' };
      }
      return nuevos;
    });
  };

  const manejarCambioServicioDirecto = (index, name, value) => {
    setServicios(prev => prev.map((s, i) => i === index ? { ...s, [name]: value } : s));
    
    // Limpiar error específico
    setErroresServicios(prev => {
      const nuevos = [...prev];
      if (nuevos[index] && nuevos[index][name]) {
        nuevos[index] = { ...nuevos[index], [name]: '' };
      }
      return nuevos;
    });
  };

  const manejarSeleccionProfesional = (index, profesional) => {
    setServicios(prev => prev.map((s, i) => i === index ? { 
      ...s, 
      id_profesional: profesional.id_personal, 
      nombre_profesional: profesional.nombre_completo 
    } : s));

    // Limpiar error de id_profesional
    setErroresServicios(prev => {
      const nuevos = [...prev];
      if (nuevos[index]) {
        nuevos[index] = { ...nuevos[index], id_profesional: '' };
      }
      return nuevos;
    });
  };

  const manejarLimpiarProfesional = (index) => {
    setServicios(prev => prev.map((s, i) => i === index ? { 
      ...s, 
      id_profesional: '', 
      nombre_profesional: '' 
    } : s));
  };

  const manejarSeleccionServicio = (index, servicio) => {
    setServicios(prev => prev.map((s, i) => i === index ? { 
      ...s, 
      id_servicio: servicio.id_servicio, 
      nombre_servicio: servicio.nombre_servicio 
    } : s));

    // Limpiar error de id_servicio
    setErroresServicios(prev => {
      const nuevos = [...prev];
      if (nuevos[index]) {
        nuevos[index] = { ...nuevos[index], id_servicio: '' };
      }
      return nuevos;
    });
  };

  const manejarLimpiarServicio = (index) => {
    setServicios(prev => prev.map((s, i) => i === index ? { 
      ...s, 
      id_servicio: '', 
      nombre_servicio: '' 
    } : s));
  };

  const validar = () => {
    let tieneErrores = false;
    const nuevosErroresGenerales = {};
    if (!autorizacion.trim()) {
      nuevosErroresGenerales.autorizacion = 'Campo obligatorio';
      tieneErrores = true;
    } else if (verifData?.en_uso) {
      nuevosErroresGenerales.autorizacion = verifData?.descripcion || 'La autorización ya está en uso';
      tieneErrores = true;
    }

    const nuevosErroresServicios = servicios.map(s => {
      const err = {};
      if (!s.id_servicio) {
        err.id_servicio = 'Campo obligatorio';
        tieneErrores = true;
      }
      if (!s.id_profesional) {
        err.id_profesional = 'Campo obligatorio';
        tieneErrores = true;
      }
      if (!s.numero_sesiones || s.numero_sesiones <= 0) {
        err.numero_sesiones = 'Debe ser mayor a 0';
        tieneErrores = true;
      }
      if (!s.frecuencia_dias || s.frecuencia_dias <= 0) {
        err.frecuencia_dias = 'Debe ser mayor a 0';
        tieneErrores = true;
      }
      if (!s.fecha_inicio) {
        err.fecha_inicio = 'Campo obligatorio';
        tieneErrores = true;
      }
     
      return err;
    });

    setErroresGenerales(nuevosErroresGenerales);
    setErroresServicios(nuevosErroresServicios);

    return !tieneErrores;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      autorizacion,
      observacion,
      id_paciente: paciente?.id_paciente || paciente?.id,
      servicios: servicios.map(s => ({
        id_servicio: parseInt(s.id_servicio, 10),
        id_profesional: parseInt(s.id_profesional, 10),
        numero_sesiones: parseInt(s.numero_sesiones, 10),
        frecuencia_dias: parseInt(s.frecuencia_dias, 10),
        fecha_inicio: s.fecha_inicio.replace('T', ' '),
      }))
    };

    console.log("PAYLOAD_ENVIAR:", payload);
    onGuardar(payload);
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCerrar} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-2xl flex items-center justify-center">
              <FilePlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase">Nueva Autorización</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Crear registro de programa con múltiples servicios</p>
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
        <form id="form-registro-autorizacion" onSubmit={manejarEnvio} className="p-8 overflow-y-auto space-y-8">
          
          {/* Fila Paciente e Info General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Paciente</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  readOnly
                  value={paciente?.nombre_completo || 'Paciente no identificado'}
                  className="w-full pl-11 pr-4 py-3.5 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Número de Autorización</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Hash size={18} />
                </div>
                <input
                  type="text"
                  name="autorizacion"
                  value={autorizacion}
                  onChange={(e) => {
                    setAutorizacion(e.target.value);
                    if (erroresGenerales.autorizacion) setErroresGenerales(prev => ({ ...prev, autorizacion: '' }));
                  }}
                  placeholder="Ej: AUT-998877"
                  className={`w-full pl-11 pr-12 py-3.5 text-sm font-bold bg-gray-50 border rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                    erroresGenerales.autorizacion || (debouncedAutorizacion.trim().length >= 3 && verifData?.en_uso) 
                      ? 'border-red-500 focus:ring-red-100' 
                      : 'border-gray-100 focus:border-blue-500 focus:ring-blue-500/10'
                  }`}
                />
                {/* Icono de Estado de Verificación */}
                {autorizacion.trim().length >= 3 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    {verifLoading ? (
                      <Loader2 size={18} className="animate-spin text-blue-500" />
                    ) : verifData?.en_uso ? (
                      <AlertCircle size={18} className="text-red-500 animate-pulse" title={verifData.descripcion} />
                    ) : (
                      <CheckCircle2 size={18} className="text-green-500" title={verifData?.descripcion} />
                    )}
                  </div>
                )}
              </div>
              {(erroresGenerales.autorizacion || (debouncedAutorizacion.trim().length >= 3 && verifData?.en_uso)) && (
                <span className="text-[10px] font-bold text-red-500 ml-1 italic">
                  {erroresGenerales.autorizacion || verifData?.descripcion || 'La autorización ya está en uso'}
                </span>
              )}
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Observación</label>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <FileText size={18} />
                </div>
                <textarea
                  name="observacion"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Observaciones o notas adicionales de la autorización..."
                  rows="2"
                  className="w-full pl-11 pr-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sección de Servicios Múltiples */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-[#2563EB]" /> Servicios Autorizados
              </h3>
              <button
                type="button"
                onClick={agregarServicio}
                className="flex items-center gap-1.5 text-xs font-black uppercase text-[#2563EB] hover:text-[#1E40AF] bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus size={14} />
                Agregar Servicio
              </button>
            </div>

            <div className="space-y-6">
              {servicios.map((srv, idx) => (
                <div 
                  key={idx} 
                  className="bg-gray-50/40 border border-gray-100 rounded-3xl p-6 relative space-y-4 hover:border-blue-100 transition-colors"
                >
                  {/* Encabezado del Servicio Card */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2.5 py-1 rounded-lg">
                      Servicio #{idx + 1}
                    </span>
                    {servicios.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarServicio(idx)}
                        className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar este servicio"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Servicio Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Servicio</label>
                      <BuscadorServicio
                        nombreServicio={srv.nombre_servicio}
                        onSeleccionar={(s) => manejarSeleccionServicio(idx, s)}
                        onLimpiar={() => manejarLimpiarServicio(idx)}
                        error={erroresServicios[idx]?.id_servicio}
                      />
                      {erroresServicios[idx]?.id_servicio && <span className="text-[10px] font-bold text-red-500 ml-1 italic">{erroresServicios[idx].id_servicio}</span>}
                    </div>

                    {/* Profesional Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profesional</label>
                      <BuscadorProfesional
                        idProfesional={srv.id_profesional}
                        nombreProfesional={srv.nombre_profesional}
                        onSeleccionar={(p) => manejarSeleccionProfesional(idx, p)}
                        onLimpiar={() => manejarLimpiarProfesional(idx)}
                        error={erroresServicios[idx]?.id_profesional}
                      />
                      {erroresServicios[idx]?.id_profesional && <span className="text-[10px] font-bold text-red-500 ml-1 italic">{erroresServicios[idx].id_profesional}</span>}
                    </div>

                    {/* Número Sesiones */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Número de Sesiones</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <Clock size={18} />
                        </div>
                        <input
                          type="number"
                          name="numero_sesiones"
                          value={srv.numero_sesiones}
                          onChange={(e) => manejarCambioServicio(idx, e)}
                          placeholder="Ej: 10"
                          min="1"
                          className={`w-full pl-11 pr-4 py-3 text-sm font-bold bg-white border rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                            erroresServicios[idx]?.numero_sesiones ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-blue-500 focus:ring-blue-500/10'
                          }`}
                        />
                      </div>
                      {erroresServicios[idx]?.numero_sesiones && <span className="text-[10px] font-bold text-red-500 ml-1 italic">{erroresServicios[idx].numero_sesiones}</span>}
                    </div>

                    {/* Frecuencia Días */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Frecuencia (Días)</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <Clock size={18} />
                        </div>
                        <input
                          type="number"
                          name="frecuencia_dias"
                          value={srv.frecuencia_dias}
                          onChange={(e) => manejarCambioServicio(idx, e)}
                          placeholder="Ej: 2 (Cada 2 días)"
                          min="1"
                          className={`w-full pl-11 pr-4 py-3 text-sm font-bold bg-white border rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                            erroresServicios[idx]?.frecuencia_dias ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-blue-500 focus:ring-blue-500/10'
                          }`}
                        />
                      </div>
                      {erroresServicios[idx]?.frecuencia_dias && <span className="text-[10px] font-bold text-red-500 ml-1 italic">{erroresServicios[idx].frecuencia_dias}</span>}
                    </div>

                    {/* Fecha Inicio */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha de Inicio</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Selector de Fecha */}
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Calendar size={18} />
                          </div>
                          <input
                            type="date"
                            value={parseFechaInicio(srv.fecha_inicio).date}
                            onChange={(e) => {
                              const { hour, minute, period } = parseFechaInicio(srv.fecha_inicio);
                              const nuevaFecha = buildFechaInicio(e.target.value, hour, minute, period);
                              manejarCambioServicioDirecto(idx, 'fecha_inicio', nuevaFecha);
                            }}
                            className={`w-full pl-11 pr-4 py-3 text-sm font-bold bg-white border rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                              erroresServicios[idx]?.fecha_inicio ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-blue-500 focus:ring-blue-500/10'
                            }`}
                          />
                        </div>

                        {/* Selector de Hora 12h */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-2xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                          <Clock size={16} className="text-gray-400 mr-1 flex-shrink-0" />
                          <select
                            value={parseFechaInicio(srv.fecha_inicio).hour}
                            onChange={(e) => {
                              const { date, minute, period } = parseFechaInicio(srv.fecha_inicio);
                              const nuevaFecha = buildFechaInicio(date, e.target.value, minute, period);
                              manejarCambioServicioDirecto(idx, 'fecha_inicio', nuevaFecha);
                            }}
                            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer py-1"
                          >
                            {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(h => (
                              <option key={h} value={h}>{h.padStart(2, '0')}</option>
                            ))}
                          </select>
                          <span className="text-gray-400 font-bold">:</span>
                          <select
                            value={parseFechaInicio(srv.fecha_inicio).minute}
                            onChange={(e) => {
                              const { date, hour, period } = parseFechaInicio(srv.fecha_inicio);
                              const nuevaFecha = buildFechaInicio(date, hour, e.target.value, period);
                              manejarCambioServicioDirecto(idx, 'fecha_inicio', nuevaFecha);
                            }}
                            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer py-1"
                          >
                            {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            value={parseFechaInicio(srv.fecha_inicio).period}
                            onChange={(e) => {
                              const { date, hour, minute } = parseFechaInicio(srv.fecha_inicio);
                              const nuevaFecha = buildFechaInicio(date, hour, minute, e.target.value);
                              manejarCambioServicioDirecto(idx, 'fecha_inicio', nuevaFecha);
                            }}
                            className="bg-transparent text-sm font-black text-blue-600 outline-none cursor-pointer py-1 ml-auto"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                      {erroresServicios[idx]?.fecha_inicio && <span className="text-[10px] font-bold text-red-500 ml-1 italic">{erroresServicios[idx].fecha_inicio}</span>}
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0">
          <button 
            type="button" 
            onClick={onCerrar} 
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="form-registro-autorizacion"
            disabled={cargando}
            className="px-8 py-2.5 bg-[#2563EB] text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-[#1E40AF] disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {cargando && <Loader2 size={18} className="animate-spin" />}
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
