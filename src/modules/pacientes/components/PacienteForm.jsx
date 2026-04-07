import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2, Info, MapPin, ShieldCheck } from 'lucide-react';
import { 
  useCrearPacienteMutation, 
  useActualizarPacienteMutation, 
  useAseguradorasQuery,
  useBarriosQuery
} from '../queries/usePacientesQuery';

const FORM_INICIAL = {
  nombre_completo: '',
  tipo_documento: 'CC',
  identificacion: '',
  fecha_nacimiento: '',
  sexo: 'M',
  telefono: '',
  email: '',
  id_aseguradora: '',
  regimen: 'CONTRIBUTIVO',
  fecha_ingreso: new Date().toISOString().split('T')[0],
  direccion: '',
  id_barrio: '',
  url_google_maps: '',
  estado: 'ACTIVO',
};

/**
 * Formulario Completo de Paciente con carga de Aseguradoras reales.
 */
export default function PacienteForm({ abierto, onCerrar, paciente }) {
  const [formulario, setFormulario] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});

  // Queries y Mutations
  const { data: respAseguradoras, isLoading: cargandoAseguradoras } = useAseguradorasQuery();
  const { data: respBarrios, isLoading: cargandoBarrios } = useBarriosQuery();
  const { mutate: crearPaciente, isPending: creando } = useCrearPacienteMutation();
  const { mutate: actualizarPaciente, isPending: actualizando } = useActualizarPacienteMutation();

  const aseguradoras = respAseguradoras?.data || [];
  const barrios = respBarrios?.data || [];
  const modoEdicion = !!paciente;
  const enviando = creando || actualizando;

  // Sincronizar datos al editar
  useEffect(() => {
    if (abierto) {
      if (paciente) {
        setFormulario({
          nombre_completo: paciente.nombre_completo || '',
          tipo_documento: paciente.tipo_documento || 'CC',
          identificacion: paciente.identificacion || '',
          fecha_nacimiento: paciente.fecha_nacimiento || '',
          sexo: paciente.sexo || 'M',
          telefono: paciente.telefono || '',
          email: paciente.email || '',
          id_aseguradora: paciente.id_aseguradora || '',
          regimen: paciente.regimen || 'CONTRIBUTIVO',
          fecha_ingreso: paciente.fecha_ingreso || '',
          direccion: paciente.direccion || '',
          id_barrio: paciente.id_barrio || '',
          url_google_maps: paciente.url_google_maps || '',
          estado: paciente.estado || 'ACTIVO',
        });
      } else {
        setFormulario(FORM_INICIAL);
      }
      setErrores({});
    }
  }, [abierto, paciente]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.nombre_completo.trim()) nuevosErrores.nombre_completo = 'Campo obligatorio';
    if (!formulario.identificacion.trim()) nuevosErrores.identificacion = 'Campo obligatorio';
    if (!formulario.id_aseguradora) nuevosErrores.id_aseguradora = 'Seleccione aseguradora';
    if (!formulario.direccion.trim()) nuevosErrores.direccion = 'Campo obligatorio';
    return nuevosErrores;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const payload = { 
      ...formulario, 
      id_aseguradora: Number(formulario.id_aseguradora),
      id_barrio: formulario.id_barrio ? Number(formulario.id_barrio) : null 
    };

    if (modoEdicion) {
      actualizarPaciente({ id: paciente.id_paciente, datos: payload }, { onSuccess: onCerrar });
    } else {
      crearPaciente(payload, { onSuccess: onCerrar });
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCerrar} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase">
                {modoEdicion ? 'Editar Registro' : 'Nuevo Paciente'}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Atención Domiciliaria / Programa Salud</p>
            </div>
          </div>
          <button onClick={onCerrar} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form id="form-paciente-completo" onSubmit={manejarEnvio} className="overflow-y-auto p-8 space-y-8">
          
          {/* Sección 1: Identidad */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-2">
              <Info size={14} /> Información Personal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Campo
                  label="Nombre Completo"
                  name="nombre_completo"
                  value={formulario.nombre_completo}
                  error={errores.nombre_completo}
                  onChange={manejarCambio}
                  placeholder="Ej: JUAN PEREZ"
                />
              </div>
              <CampoSelect
                label="Sexo"
                name="sexo"
                value={formulario.sexo}
                onChange={manejarCambio}
                opciones={[{v:'M', t:'Masculino'}, {v:'F', t:'Femenino'}]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CampoSelect
                label="Tipo Doc."
                name="tipo_documento"
                value={formulario.tipo_documento}
                onChange={manejarCambio}
                opciones={[{v:'CC', t:'Cédula de Ciudadanía'}, {v:'TI', t:'Tarjeta Identidad'}, {v:'RC', t:'Registro Civil'}, {v:'CE', t:'Extranjería'}]}
              />
              <Campo
                label="Número Identificación"
                name="identificacion"
                value={formulario.identificacion}
                error={errores.identificacion}
                onChange={manejarCambio}
              />
              <Campo
                label="Fecha Nacimiento"
                name="fecha_nacimiento"
                tipo="date"
                value={formulario.fecha_nacimiento}
                onChange={manejarCambio}
              />
            </div>
          </section>

          {/* Sección 2: Salud y Administrativo */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest border-b border-green-50 pb-2">
              <ShieldCheck size={14} /> Datos de Salud y Aseguradora
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CampoSelect
                label="Aseguradora"
                name="id_aseguradora"
                value={formulario.id_aseguradora}
                error={errores.id_aseguradora}
                onChange={manejarCambio}
                disabled={cargandoAseguradoras}
                opciones={[{v:'', t:'Seleccione...'}, ...aseguradoras.map(a => ({v: a.id_aseguradora, t: a.nombre}))]}
              />
              <CampoSelect
                label="Régimen"
                name="regimen"
                value={formulario.regimen}
                onChange={manejarCambio}
                opciones={[{v:'CONTRIBUTIVO', t:'Contributivo'}, {v:'SUBSIDIADO', t:'Subsidiado'}, {v:'PARTICULAR', t:'Particular'}]}
              />
              <CampoSelect
                label="Estado Sistema"
                name="estado"
                value={formulario.estado}
                onChange={manejarCambio}
                opciones={[{v:'ACTIVO', t:'Activo'}, {v:'INACTIVO', t:'Inactivo'}, {v:'FALLECIDO', t:'Fallecido'}]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Campo
                 label="Fecha Ingreso"
                 name="fecha_ingreso"
                 tipo="date"
                 value={formulario.fecha_ingreso}
                 onChange={manejarCambio}
              />
            </div>
          </section>

          {/* Sección 3: Contacto y Ubicación */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-2">
              <MapPin size={14} /> Contacto y Residencia
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Campo label="Teléfono / Celular" name="telefono" value={formulario.telefono} onChange={manejarCambio} />
               <Campo label="Email" name="email" tipo="email" value={formulario.email} onChange={manejarCambio} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Campo label="Dirección de Residencia" name="direccion" value={formulario.direccion} error={errores.direccion} onChange={manejarCambio} />
              </div>
              <CampoSelect 
                label="Barrio" 
                name="id_barrio" 
                value={formulario.id_barrio} 
                onChange={manejarCambio} 
                disabled={cargandoBarrios}
                opciones={[{v:'', t:'Seleccione...'}, ...barrios.map(b => ({v: b.id_barrio, t: b.nombre}))]}
              />
            </div>
            <Campo label="URL Google Maps (Opcional)" name="url_google_maps" value={formulario.url_google_maps} onChange={manejarCambio} placeholder="https://maps.google.com/..." />
          </section>

        </form>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0">
          <button onClick={onCerrar} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-all">
            Cancelar
          </button>
          <button 
            type="submit" 
            form="form-paciente-completo"
            disabled={enviando}
            className="px-8 py-2.5 bg-[#2563EB] text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-[#1E40AF] disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {enviando && <Loader2 size={18} className="animate-spin" />}
            {modoEdicion ? 'Actualizar Paciente' : 'Registrar Paciente'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers Visuales ─────────────────────────────────────────────────────────

function Campo({ label, name, value, error, onChange, placeholder, tipo = 'text' }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={tipo}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 text-sm font-bold bg-gray-50 border rounded-2xl focus:outline-none focus:ring-4 transition-all ${
          error ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-blue-500 focus:ring-blue-500/10'
        }`}
      />
      {error && <span className="text-[10px] font-bold text-red-500 ml-1 italic">{error}</span>}
    </div>
  );
}

function CampoSelect({ label, name, value, error, onChange, opciones, disabled }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 text-sm font-bold bg-gray-50 border rounded-2xl focus:outline-none focus:ring-4 transition-all appearance-none ${
          error ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-blue-500 focus:ring-blue-500/10'
        }`}
      >
        {opciones.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
      </select>
      {error && <span className="text-[10px] font-bold text-red-500 ml-1 italic">{error}</span>}
    </div>
  );
}
