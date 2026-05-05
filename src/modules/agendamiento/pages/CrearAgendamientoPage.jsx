import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, ShieldCheck, ExternalLink, 
  Plus, Trash2, User, Stethoscope, Hash, Save, Calendar
} from 'lucide-react';

import AsyncSearchSelect from '../components/AsyncSearchSelect';
import { 
  useIngresosBusqueda, 
  useServiciosBusqueda, 
  usePersonalBusqueda 
} from '../queries/useBusquedaQueries';

export default function CrearAgendamientoPage() {
  const navigate = useNavigate();


  // Estados
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  
  // Lista dinámica de servicios
  const [servicios, setServicios] = useState([
    { 
      id: Date.now(), 
      servicio: null, // Guardaremos el objeto completo del servicio seleccionado
      profesional: null, // Guardaremos el objeto completo del personal seleccionado
      sesiones: '',
      fecha_inicio: ''
    }
  ]);

  const handleAgregarServicio = () => {
    setServicios([
      ...servicios, 
      { id: Date.now(), servicio: null, profesional: null, sesiones: '', fecha_inicio: '' }
    ]);
  };

  const handleEliminarServicio = (id) => {
    if (servicios.length > 1) {
      setServicios(servicios.filter(s => s.id !== id));
    }
  };

  const handleChangeServicio = (id, campo, valor) => {
    setServicios(servicios.map(s => 
      s.id === id ? { ...s, [campo]: valor } : s
    ));
  };

  const handleGuardar = () => {
    // Construir el payload limpio (IDs en lugar de objetos completos) para el backend
    const payload = {
      id_ingreso: ingresoSeleccionado?.id_ingreso || null,
      observaciones: observaciones,
      servicios: servicios.map(s => ({
        id_servicio: s.servicio?.id_servicio || null,
        id_personal: s.profesional?.id_personal || null,
        fecha_inicio: s.fecha_inicio,
        sesiones: parseInt(s.sesiones, 10) || null
      }))
    };

    console.log("JSON Payload a enviar al backend:", JSON.stringify(payload, null, 2));
    // Aquí iría el POST: await agendamientoService.crearOrden(payload);
  };

  // Renderers para las opciones del Autocomplete
  const renderIngresoOption = (item) => (
    <div>
      <p className="text-sm font-black text-gray-900 group-hover:text-[#2563EB]">{item.nombre_completo}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 rounded">ING: {item.ingreso}</span>
        <span className="text-[10px] font-bold text-gray-400">CC: {item.identificacion}</span>
      </div>
    </div>
  );

  const renderServicioOption = (item) => (
    <div>
      <p className="text-sm font-black text-gray-900 group-hover:text-[#2563EB]">{item.nombre_servicio}</p>
      <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{item.codigo_servicio}</p>
    </div>
  );

  const renderPersonalOption = (item) => (
    <div>
      <p className="text-sm font-black text-gray-900 group-hover:text-[#2563EB]">{item.nombre_completo}</p>
      <p className="text-[10px] font-bold text-gray-400 mt-0.5">{item.tipo_documento}: {item.numero_documento}</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header Area */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/agendamiento')}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-[#2563EB] hover:bg-blue-50 transition-all shadow-sm"
          title="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Crear Orden Médica</h1>
          <p className="text-gray-500 font-medium">Asignación de servicios y agendamiento de profesionales.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Información de Ingreso y Observaciones */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          
          {/* Card: Búsqueda de Ingreso */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm relative overflow-visible z-30">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#2563EB] rounded-l-3xl"></div>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Datos del Paciente</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Número de Ingreso</label>
                
                <AsyncSearchSelect
                  useQueryHook={useIngresosBusqueda}
                  placeholder="Ej. 12345..."
                  onSelect={(item) => setIngresoSeleccionado(item)}
                  renderOption={renderIngresoOption}
                  valueDisplay={ingresoSeleccionado ? `${ingresoSeleccionado.nombre_completo} (ING: ${ingresoSeleccionado.ingreso})` : ''}
                  onClear={() => setIngresoSeleccionado(null)}
                  icon={Search}
                />

              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">¿No encuentras el ingreso?</span>
                <button className="flex items-center gap-1 text-[10px] font-black text-[#2563EB] hover:text-[#1E40AF] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                  <ExternalLink size={12} />
                  Servicio Externo
                </button>
              </div>

              {/* Autorización detectada dinámicamente */}
              {ingresoSeleccionado && ingresoSeleccionado.autorizacion && (
                <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={16} className="text-[#16A34A]" />
                    <span className="text-xs font-black text-green-800 uppercase tracking-wider">Autorización Vinculada</span>
                  </div>
                  <p className="text-sm font-bold text-green-700 font-mono mt-2">{ingresoSeleccionado.autorizacion}</p>
                  <p className="text-[10px] font-bold text-green-600/70 uppercase mt-1">CC: {ingresoSeleccionado.identificacion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Observaciones */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm z-10 relative">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Información Adicional</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Observaciones</label>
              <textarea
                rows={4}
                placeholder="Escribe aquí notas adicionales, recomendaciones o condiciones específicas..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm font-medium resize-none"
              ></textarea>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Creación de Órdenes y Servicios */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm relative z-20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Stethoscope size={20} className="text-[#2563EB]" />
                  Órdenes y Servicios
                </h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">Asigna los servicios a ejecutar</p>
              </div>
              <span className="bg-blue-50 text-[#2563EB] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                {servicios.length} {servicios.length === 1 ? 'Servicio' : 'Servicios'}
              </span>
            </div>

            <div className="space-y-4">
              {servicios.map((servicio, index) => (
                <div key={servicio.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl relative group transition-all hover:border-[#2563EB]/30" style={{ zIndex: 100 - index }}>
                  {/* Número identificador */}
                  <div className="absolute -left-3 -top-3 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-black text-gray-500 shadow-sm z-10">
                    {index + 1}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    
                    {/* Servicio */}
                    <div className="md:col-span-6">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Servicio a Prestar</label>
                      <AsyncSearchSelect
                        useQueryHook={useServiciosBusqueda}
                        placeholder="Buscar servicio médico..."
                        onSelect={(item) => handleChangeServicio(servicio.id, 'servicio', item)}
                        renderOption={renderServicioOption}
                        valueDisplay={servicio.servicio ? servicio.servicio.nombre_servicio : ''}
                        onClear={() => handleChangeServicio(servicio.id, 'servicio', null)}
                        icon={Stethoscope}
                      />
                    </div>

                    {/* Profesional */}
                    <div className="md:col-span-6">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Profesional Asignado</label>
                      <AsyncSearchSelect
                        useQueryHook={usePersonalBusqueda}
                        placeholder="Buscar profesional..."
                        onSelect={(item) => handleChangeServicio(servicio.id, 'profesional', item)}
                        renderOption={renderPersonalOption}
                        valueDisplay={servicio.profesional ? `${servicio.profesional.nombre_completo} (${servicio.profesional.tipo_documento}: ${servicio.profesional.numero_documento})` : ''}
                        onClear={() => handleChangeServicio(servicio.id, 'profesional', null)}
                        icon={User}
                      />
                    </div>

                    {/* Fecha de Inicio */}
                    <div className="md:col-span-6 xl:col-span-8">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Fecha de Inicio</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Calendar size={16} />
                        </div>
                        <input
                          type="datetime-local"
                          value={servicio.fecha_inicio}
                          onChange={(e) => handleChangeServicio(servicio.id, 'fecha_inicio', e.target.value)}
                          className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm font-medium text-gray-700"
                        />
                      </div>
                    </div>

                    {/* Sesiones */}
                    <div className="md:col-span-6 xl:col-span-4">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Total Sesiones</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Hash size={16} />
                        </div>
                        <input
                          type="number"
                          min="1"
                          placeholder="Ej. 10"
                          value={servicio.sesiones}
                          onChange={(e) => handleChangeServicio(servicio.id, 'sesiones', e.target.value)}
                          className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Botón Eliminar Fila */}
                  {servicios.length > 1 && (
                    <button
                      onClick={() => handleEliminarServicio(servicio.id)}
                      className="absolute -right-3 -top-3 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                      title="Eliminar Servicio"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Agregar Otro Servicio */}
            <div className="mt-4 flex justify-center border-t border-dashed border-gray-200 pt-6">
              <button
                onClick={handleAgregarServicio}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50 transition-all text-xs uppercase tracking-widest"
              >
                <Plus size={16} />
                Agregar Otro Servicio
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 px-8 z-40 flex justify-end gap-4 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => navigate('/agendamiento')}
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm"
        >
          Cancelar
        </button>
        <button 
          className="flex items-center gap-2 px-8 py-3 bg-[#16A34A] text-white rounded-xl font-bold hover:bg-[#15803d] transition-all shadow-lg shadow-green-500/30 text-sm"
          onClick={handleGuardar}
        >
          <Save size={18} />
          Guardar Agendamiento
        </button>
      </div>

    </div>
  );
}
