import React from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  ExternalLink,
  ShieldCheck,
  Heart,
  UserCheck
} from 'lucide-react';

/**
 * Tarjeta detallada de Paciente con relaciones (Aseguradora, Madrina, Barrio).
 */
export default function PacienteCard({ paciente, onEditar }) {
  const {
    id_paciente,
    nombre_completo,
    tipo_documento,
    identificacion,
    sexo,
    fecha_nacimiento,
    telefono,
    email,
    regimen,
    fecha_ingreso,
    direccion,
    url_google_maps,
    estado,
    aseguradora,
    madrina,
    barrio
  } = paciente;

  const iniciales = nombre_completo
    ?.split(' ')
    .filter(n => n.length > 0)
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('') || '?';

  const esActivo = estado === 'ACTIVO';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Cabecera */}
      <div className="p-5 border-b border-gray-50 bg-gray-50/30">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
              sexo === 'F' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-[#2563EB]'
            }`}>
              {iniciales}
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 leading-tight uppercase group-hover:text-[#2563EB] transition-colors line-clamp-1">
                {nombre_completo}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded tracking-wider">
                  {tipo_documento} {identificacion}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                  esActivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {estado}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => onEditar(paciente)}
            className="p-2 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-all"
            title="Editar información"
          >
            <User size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <InfoMini icon={Calendar} label="Ingreso" value={fecha_ingreso} />
          <InfoMini icon={Heart} label="Sexo" value={sexo === 'F' ? 'Femenino' : 'Masculino'} />
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1">
        {/* Salud y Madrina */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Información de Salud</p>
          <div className="flex flex-wrap gap-2">
             <Pill icon={ShieldCheck} text={regimen} color="blue" />
             <Pill icon={CreditCard} text={aseguradora?.nombre || 'Sin Aseguradora'} color="green" />
          </div>
          {madrina && (
            <div className="flex items-center gap-2 mt-2 bg-purple-50 p-2 rounded-lg border border-purple-100">
              <UserCheck size={14} className="text-purple-600" />
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-tight">
                Madrina: <span className="font-black underline">{madrina.nombre_completo}</span>
              </span>
            </div>
          )}
        </div>

        {/* Contacto */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacto</p>
          <div className="space-y-1.5">
            <IconLabel icon={Phone} text={telefono || 'No registrado'} />
            <IconLabel icon={Mail} text={email || 'Sin correo asociado'} />
          </div>
        </div>

        {/* Ubicación */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ubicación</p>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 relative group/map">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-900 font-bold leading-tight line-clamp-1 italic">
                  {direccion}
                </p>
                {barrio && (
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight mt-0.5">
                    Sector: {barrio.nombre}
                  </p>
                )}
              </div>
            </div>
            {url_google_maps && (
              <a 
                href={url_google_maps} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute top-2 right-2 p-1.5 bg-white shadow-sm border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-tight">
         <span>NACIMIENTO: {fecha_nacimiento}</span>
         <span>REF: #{id_paciente}</span>
      </div>
    </div>
  );
}

// ─── Sub-componentes internos ──────────────────────────────────────────────────

function InfoMini({ icon: Icon, label, value }) {
  return (
    <div className="bg-white/60 p-2 rounded-lg border border-gray-100/50">
      <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        <Icon size={11} className="text-gray-400" />
        <span className="text-xs font-bold text-gray-700 truncate">{value}</span>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, text, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight ${colors[color] || colors.gray}`}>
      <Icon size={12} />
      {text}
    </div>
  );
}

function IconLabel({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
        <Icon size={12} />
      </div>
      <span className="font-bold text-gray-600 truncate">{text}</span>
    </div>
  );
}
