import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, User, Stethoscope, 
  Calendar, Save, ClipboardList, Info, 
  UserCheck, Hash, ShieldCheck
} from 'lucide-react';

const MOCK_INGRESOS = [
  { id_ingreso: 1, ingreso: 1001, id_paciente: 440, nombre_paciente: "ELOISA FONSECA SANDOVAL", identificacion: "37551393", autorizacion: "T37551393042026" },
  { id_ingreso: 2, ingreso: 1002, id_paciente: 441, nombre_paciente: "JUAN PEREZ", identificacion: "12345678", autorizacion: "AUTH999888" },
  { id_ingreso: 3, ingreso: 1003, id_paciente: 442, nombre_paciente: "MARIA RODRIGUEZ", identificacion: "87654321", autorizacion: "AUTH111222" },
  { id_ingreso: 4, ingreso: 1004, id_paciente: 441, nombre_paciente: "JUAN PEREZ (Nuevo Ingreso)", identificacion: "12345678", autorizacion: "AUTH-JP-2026" },
];

const MOCK_SERVICIOS_INGRESO = [
  { id_orden_servicio: 1800, id_ingreso: 1, id_servicio: 1, nombre_servicio: "ATENCION [VISITA] DOMICILIARIA, POR MEDICINA GENERAL", cantidad: 1, frecuencia: 60, estado: "ACTIVO" },
  { id_orden_servicio: 1801, id_ingreso: 1, id_servicio: 2, nombre_servicio: "TERAPIA FISICA DOMICILIARIA", cantidad: 30, frecuencia: 1, estado: "ACTIVO" },
  { id_orden_servicio: 1802, id_ingreso: 2, id_servicio: 1, nombre_servicio: "ATENCION [VISITA] DOMICILIARIA, POR MEDICINA GENERAL", cantidad: 1, frecuencia: 30, estado: "ACTIVO" },
  { id_orden_servicio: 1803, id_ingreso: 4, id_servicio: 3, nombre_servicio: "FONOAUDIOLOGIA DOMICILIARIA", cantidad: 3, frecuencia: 2, estado: "ACTIVO" },
];

const MOCK_PERSONAL = [
  { id_personal: 1, nombre_completo: "MORENO HERNANDEZ MARIA ROSSANA", especialidad: "Medicina General" },
  { id_personal: 2, nombre_completo: "PEDRO ARMANDO DIAZ", especialidad: "Terapista" },
  { id_personal: 3, nombre_completo: "LUISA FERNANDA GOMEZ", especialidad: "Enfermería" },
];

const CrearAgendamientoDos = () => {
  const navigate = useNavigate();

  // Form State
  const [ingresoBusqueda, setIngresoBusqueda] = useState('');
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [idPersonal, setIdPersonal] = useState('');
  const [fechaProgramada, setFechaProgramada] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // UI State
  const [filteredIngresos, setFilteredIngresos] = useState([]);
  const [disponibleServicios, setDisponibleServicios] = useState([]);

  // Filter ingresos on search
  useEffect(() => {
    if (ingresoBusqueda.length > 1) {
      const filtered = MOCK_INGRESOS.filter(i => 
        i.ingreso.toString().includes(ingresoBusqueda) || 
        i.nombre_paciente.toLowerCase().includes(ingresoBusqueda.toLowerCase()) ||
        i.identificacion.includes(ingresoBusqueda)
      );
      setFilteredIngresos(filtered);
    } else {
      setFilteredIngresos([]);
    }
  }, [ingresoBusqueda]);

  // Load services when ingreso is selected
  useEffect(() => {
    if (ingresoSeleccionado) {
      const services = MOCK_SERVICIOS_INGRESO.filter(s => s.id_ingreso === ingresoSeleccionado.id_ingreso);
      setDisponibleServicios(services);
      setServicioSeleccionado(null);
    } else {
      setDisponibleServicios([]);
      setServicioSeleccionado(null);
    }
  }, [ingresoSeleccionado]);

  const handleSelectIngreso = (ingreso) => {
    setIngresoSeleccionado(ingreso);
    setIngresoBusqueda('');
    setFilteredIngresos([]);
  };

  const handleGuardar = () => {
    const payload = {
      codigo_ingreso: ingresoSeleccionado?.ingreso,
      id_orden_servicio: servicioSeleccionado?.id_orden_servicio,
      id_paciente: ingresoSeleccionado?.id_paciente,
      id_personal: parseInt(idPersonal),
      fecha_programada: fechaProgramada,
      observaciones: observaciones,
      estado: 'PROGRAMADA'
    };

    alert("Agendamiento (Método 2 - Kubapp) guardado con éxito. Revisa la consola.");
    navigate('/agendamiento');
  };

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header Area */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/agendamiento')}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-[#2563EB] hover:bg-blue-50 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Crear Agendamiento <span className="text-[#2563EB]">Método 2</span></h1>
          <p className="text-gray-500 font-medium">Búsqueda por ingreso y selección de servicio directo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA: BUSQUEDA Y PACIENTE */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CARD: BUSQUEDA DE INGRESO */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm relative overflow-visible z-30">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#2563EB] rounded-l-[2.5rem]"></div>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Search size={14} />
              Localizar por Número de Ingreso
            </h3>
            
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2 ml-1">Número de Ingreso (Obligatorio)</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ej. 1001, 1004..."
                  value={ingresoBusqueda}
                  onChange={(e) => setIngresoBusqueda(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:outline-none focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 rounded-2xl text-sm font-bold transition-all shadow-inner"
                />
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Resultados de búsqueda */}
              {filteredIngresos.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2 animate-in slide-in-from-top-2">
                  {filteredIngresos.map(item => (
                    <button
                      key={item.id_ingreso}
                      onClick={() => handleSelectIngreso(item)}
                      className="w-full text-left p-3 hover:bg-blue-50 rounded-xl transition-all group border-b border-gray-50 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-black text-gray-900 group-hover:text-[#2563EB]">{item.nombre_paciente}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 tracking-wider">CC: {item.identificacion}</p>
                        </div>
                        <span className="text-[11px] font-black text-white bg-[#2563EB] px-2 py-1 rounded-lg shadow-sm">
                          ING: {item.ingreso}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info del Paciente Seleccionado */}
            {ingresoSeleccionado && (
              <div className="mt-8 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-[1.5rem]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#2563EB] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 leading-none">{ingresoSeleccionado.nombre_paciente}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-wider">Identificación: {ingresoSeleccionado.identificacion}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-3 rounded-xl border border-blue-100/50">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ingreso</p>
                      <p className="text-xs font-bold text-[#2563EB]"># {ingresoSeleccionado.ingreso}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-100/50">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Autorización</p>
                      <p className="text-xs font-bold text-[#16A34A] truncate">{ingresoSeleccionado.autorizacion}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
                  <ShieldCheck size={16} className="text-[#16A34A]" />
                  <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Paciente cargado automáticamente</span>
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
              placeholder="Escribe aquí detalles adicionales para el profesional..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm font-medium resize-none"
            ></textarea>
          </div>
        </div>

        {/* COLUMNA DERECHA: SELECCION DE SERVICIO Y AGENDAMIENTO */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm relative">
            <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2 mb-8">
              <Stethoscope size={24} className="text-[#2563EB]" />
              Detalles del Agendamiento
            </h3>

            {!ingresoSeleccionado ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed border-gray-100 rounded-[2rem]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Info size={32} />
                </div>
                <div>
                  <p className="text-gray-400 font-bold">Selecciona un ingreso para habilitar el formulario</p>
                  <p className="text-gray-300 text-xs mt-1">Usa el buscador en la columna de la izquierda</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* SELECCION DE SERVICIO */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Servicio correspondiente (Cargados desde el Ingreso)</label>
                    <div className="relative">
                      <select
                        value={servicioSeleccionado?.id_orden_servicio || ''}
                        onChange={(e) => setServicioSeleccionado(disponibleServicios.find(s => s.id_orden_servicio === parseInt(e.target.value)))}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 focus:outline-none focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 rounded-2xl text-sm font-bold transition-all appearance-none"
                      >
                        <option value="" disabled>Seleccione un servicio del ingreso...</option>
                        {disponibleServicios.map(s => (
                          <option key={s.id_orden_servicio} value={s.id_orden_servicio}>{s.nombre_servicio}</option>
                        ))}
                      </select>
                      <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB]" size={20} />
                    </div>
                  </div>
                </div>

                {/* SELECCION DE PERSONAL Y FECHA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Profesional / Personal</label>
                    <div className="relative">
                      <select
                        value={idPersonal}
                        onChange={(e) => setIdPersonal(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 focus:outline-none focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 rounded-2xl text-sm font-bold transition-all appearance-none"
                      >
                        <option value="" disabled>Seleccione un profesional...</option>
                        {MOCK_PERSONAL.map(p => (
                          <option key={p.id_personal} value={p.id_personal}>{p.nombre_completo} ({p.especialidad})</option>
                        ))}
                      </select>
                      <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB]" size={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Fecha y Hora Programada</label>
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

                {/* RESUMEN DE SELECCION */}
                {servicioSeleccionado && (
                  <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-[2rem] border-l-4 border-l-[#2563EB]">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Resumen del Servicio Seleccionado</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-medium">Servicio:</span>
                        <span className="text-gray-900 text-sm font-black">{servicioSeleccionado.nombre_servicio}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-medium">Sesiones Contratadas:</span>
                        <span className="text-[#2563EB] text-sm font-black px-3 py-1 bg-blue-50 rounded-lg">{servicioSeleccionado.numero_sesiones}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-medium">Frecuencia Sugerida:</span>
                        <span className="text-gray-900 text-sm font-bold">Cada {servicioSeleccionado.frecuencia_dias} días</span>
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
          onClick={() => navigate('/agendamiento')}
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm"
        >
          Cancelar
        </button>
        <button 
          disabled={!ingresoSeleccionado || !servicioSeleccionado || !idPersonal || !fechaProgramada}
          className="flex items-center gap-2 px-8 py-3 bg-[#16A34A] text-white rounded-xl font-bold hover:bg-[#15803d] transition-all shadow-lg shadow-green-500/30 text-sm disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
          onClick={handleGuardar}
        >
          <Save size={18} />
          Guardar Agendamiento
        </button>
      </div>
    </div>
  );
};

export default CrearAgendamientoDos;
