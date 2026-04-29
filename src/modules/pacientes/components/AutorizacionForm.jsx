import React, { useState, useEffect } from 'react';
import { X, FilePlus, Loader2, Hash, Calendar } from 'lucide-react';

const FORM_INICIAL = {
  autorizacion: '',
  fecha_ingreso: new Date().toISOString().slice(0, 16), // Format for datetime-local
  ingreso: '',
};

export default function AutorizacionForm({ abierto, onCerrar, onGuardar, autorizacion, cargando }) {
  const [formulario, setFormulario] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});

  const modoEdicion = !!autorizacion;

  useEffect(() => {
    if (abierto) {
      if (autorizacion) {
        setFormulario({
          autorizacion: autorizacion.autorizacion || '',
          fecha_ingreso: autorizacion.fecha_ingreso ? autorizacion.fecha_ingreso.replace(' ', 'T') : '',
          ingreso: autorizacion.ingreso || '',
        });
      } else {
        setFormulario(FORM_INICIAL);
      }
      setErrores({});
    }
  }, [abierto, autorizacion]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.autorizacion.trim()) nuevosErrores.autorizacion = 'Campo obligatorio';
    if (!formulario.fecha_ingreso) nuevosErrores.fecha_ingreso = 'Campo obligatorio';
    if (!formulario.ingreso) nuevosErrores.ingreso = 'Campo obligatorio';
    return nuevosErrores;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    
    // Convert back to backend format
    const payload = {
      ...formulario,
      fecha_ingreso: formulario.fecha_ingreso.replace('T', ' '),
    };
    
    onGuardar(payload);
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCerrar} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <FilePlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase">
                {modoEdicion ? 'Editar Autorización' : 'Nueva Autorización'}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Documentación de Ingreso</p>
            </div>
          </div>
          <button onClick={onCerrar} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form id="form-autorizacion" onSubmit={manejarEnvio} className="p-8 space-y-6">
          <Campo
            label="Número de Autorización"
            name="autorizacion"
            value={formulario.autorizacion}
            error={errores.autorizacion}
            onChange={manejarCambio}
            placeholder="Ej: AUT-2024-001"
            icon={Hash}
          />
          
          <Campo
            label="Fecha de Ingreso"
            name="fecha_ingreso"
            tipo="datetime-local"
            value={formulario.fecha_ingreso}
            error={errores.fecha_ingreso}
            onChange={manejarCambio}
            icon={Calendar}
          />

          <Campo
            label="ID de Ingreso"
            name="ingreso"
            tipo="number"
            value={formulario.ingreso}
            error={errores.ingreso}
            onChange={manejarCambio}
            placeholder="Ej: 12345"
            icon={Hash}
          />
        </form>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0">
          <button onClick={onCerrar} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-all">
            Cancelar
          </button>
          <button 
            type="submit" 
            form="form-autorizacion"
            disabled={cargando}
            className="px-8 py-2.5 bg-[#2563EB] text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-[#1E40AF] disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {cargando && <Loader2 size={18} className="animate-spin" />}
            {modoEdicion ? 'Actualizar' : 'Registrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, name, value, error, onChange, placeholder, tipo = 'text', icon: Icon }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={tipo}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-3 text-sm font-bold bg-gray-50 border rounded-2xl focus:outline-none focus:ring-4 transition-all ${
            error ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-blue-500 focus:ring-blue-500/10'
          }`}
        />
      </div>
      {error && <span className="text-[10px] font-bold text-red-500 ml-1 italic">{error}</span>}
    </div>
  );
}
