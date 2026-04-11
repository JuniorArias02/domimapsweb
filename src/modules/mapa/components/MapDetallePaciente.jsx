import React from 'react';
import { useMapaStore, MENU_IDS } from '../store/mapaStore';
import { useMapaDetallePacienteQuery } from '../queries/useMapaDetallePacienteQuery';
import { 
  X, User, Phone, Mail, MapPin, Calendar, 
  Stethoscope, Clock, FileText, ChevronRight, 
  ExternalLink, ClipboardList, Activity, MessageCircle 
} from 'lucide-react';


export default function MapDetallePaciente() {
  const { 
    selectedPacienteId, 
    cerrarDetalle,
    isMapSidebarOpen,
    activeMenuId
  } = useMapaStore();

  const isMenuOpen = activeMenuId === MENU_IDS.DETALLE_PACIENTE;
  const { data: detailData, isLoading, isError } = useMapaDetallePacienteQuery(selectedPacienteId);

  if (!selectedPacienteId) return null;

  const { paciente, ultima_visita, diagnosticos } = detailData?.data || {};

  // Calculate left position based on the main sidebar only (since menus are now exclusive)
  let leftPos = isMapSidebarOpen ? 320 : 0;

  return (
    <div 
      className={`absolute top-20 bottom-0 w-[400px] bg-white shadow-2xl z-[410] transition-all duration-300 flex flex-col border-l border-gray-100 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full opacity-0 pointer-events-none'
      }`}
      style={{ left: `${leftPos}px` }}
    >
      {/* Header Profile - Mejorado con Layout Seguro */}
      <div className="relative bg-[#2563EB] pt-12 pb-6 px-6 shadow-md z-10 border-b border-[#1E40AF]">
        <button 
          onClick={cerrarDetalle}
          className="absolute top-4 right-4 text-white hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-md transition-all active:scale-95"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
        
        <div className="flex items-center gap-5 relative z-10">
          {/* Profile Circle (Ahora en línea, ya no se corta) */}
          <div className="w-[72px] h-[72px] rounded-full bg-white shadow-xl flex items-center justify-center text-[#2563EB] flex-shrink-0 border-4 border-white/20 bg-clip-padding relative">
            <User size={32} strokeWidth={2.5} />
            {paciente?.estado === 'ACTIVO' && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 overflow-hidden">
            <h2 className="text-white text-[17px] font-black uppercase leading-[1.1] truncate mb-2">
              {paciente?.nombre_completo || 'Cargando...'}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black bg-white/20 text-white px-2.5 py-1 rounded-md backdrop-blur-sm tracking-wide">
                {paciente?.tipo_documento} {paciente?.identificacion}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm ${
                paciente?.estado === 'ACTIVO' ? 'bg-green-400 text-green-950' : 'bg-gray-200 text-gray-800'
              }`}>
                {paciente?.estado || '...'}
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-10 px-6 pb-6 space-y-8">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cargando expediente...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 font-bold">Error al cargar datos del paciente</div>
        ) : (
          <>
            {/* Contact Information Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Información de Contacto</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {/* Phone Section with WhatsApp Logic */}
                <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">Contactos Directos</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {paciente?.telefono ? (
                      paciente.telefono.split(/[/,-]+/).map((tel, idx) => {
                        const cleanTel = tel.trim().replace(/\s/g, '');
                        if (!cleanTel) return null;
                        
                        return (
                          <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-50 shadow-sm">
                            <span className="text-sm font-black text-gray-700 tracking-tight">{cleanTel}</span>
                            <div className="flex gap-2">
                              {/* Botón Llamada */}
                              <a 
                                href={`tel:${cleanTel}`}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                title="Llamar"
                              >
                                <Phone size={14} />
                              </a>
                              {/* Botón WhatsApp */}
                              <a 
                                href={`https://wa.me/57${cleanTel}`} // Agrego prefijo 57 por defecto (Colombia), ajustar si es dinámico
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                                title="Enviar WhatsApp"
                              >
                                <MessageCircle size={14} />
                              </a>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-400 italic">No registra teléfonos</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1">
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Dirección</span>
                    <span className="text-sm font-bold text-gray-900 line-clamp-2">{paciente?.direccion}</span>
                    <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1 mt-1">
                      {paciente?.nombre_barrio}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm transition-colors">
                    <Shield size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Aseguradora</span>
                    <span className="text-sm font-bold text-gray-900 uppercase">{paciente?.nombre_aseguradora}</span>
                    <span className="text-[11px] text-gray-500 font-medium block">Régimen: {paciente?.regimen}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Health & Last Visit Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-green-500 rounded-full"></div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Última Atención</h3>
              </div>
              
              {ultima_visita ? (
                <div className="bg-[#16A34A]/5 border border-[#16A34A]/20 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-green-500/10">
                    <Stethoscope size={80} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black bg-green-500 text-white px-2 py-0.5 rounded-full uppercase">
                        {ultima_visita.estado_visita}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-green-700 font-bold">
                        <Calendar size={12} /> {ultima_visita.fecha_realizada}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-2 leading-tight">
                      {ultima_visita.nombre_servicio}
                    </p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-500/10">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <User size={12} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{ultima_visita.nombre_profesional}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-400 italic">No se registran visitas previas</p>
                </div>
              )}
            </section>

            {/* Diagnósticos Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-red-500 rounded-full"></div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Diagnósticos ({diagnosticos?.length || 0})</h3>
              </div>
              <div className="space-y-2">
                {diagnosticos?.map((dx, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex-shrink-0 flex items-center justify-center text-red-500 font-bold text-xs">
                      {dx.codigo}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700 leading-tight">
                        {dx.descripcion}
                      </p>
                      {dx.es_principal === 1 && (
                        <span className="text-[9px] font-black text-red-500 uppercase mt-1 block">Principal</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Actions */}
            <section className="pt-4 flex flex-col gap-3">
              <a 
                href={paciente?.url_google_maps} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                <ExternalLink size={18} />
                Ver en Google Maps
              </a>
              <button 
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 active:bg-gray-100 font-black py-3 px-4 rounded-xl transition-all"
              >
                <ClipboardList size={18} className="text-[#2563EB]" />
                Historial Completo
              </button>
            </section>

          </>
        )}
      </div>
    </div>
  );
}

// Simple internal Shield icon since it was missing in common list but requested for aesthetics
const Shield = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
