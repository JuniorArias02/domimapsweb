import React, { useState, useMemo } from 'react';
import { usePersonalQuery } from '../queries/usePersonalQuery';
import { useNavigate } from 'react-router-dom';
import { Users, UserCircle, Search, Stethoscope, Mail, Phone, ChevronRight, Activity, ShieldCheck } from 'lucide-react';

export const PersonalListPage = () => {
  const { data: personal = [], isLoading, isError } = usePersonalQuery();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Ensuring data is an array just in case the backend returns something else
  const personalArray = Array.isArray(personal) ? personal : (personal.data || []);

  // Filter logic
  const filteredPersonal = useMemo(() => {
    return personalArray.filter(p => {
      const term = searchTerm.toLowerCase();
      return (
        (p.nombre_completo && p.nombre_completo.toLowerCase().includes(term)) ||
        (p.numero_documento && p.numero_documento.toLowerCase().includes(term)) ||
        (p.especialidad && p.especialidad.toLowerCase().includes(term))
      );
    });
  }, [personalArray, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl">
              <Users className="w-8 h-8 text-[#2563EB]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Directorio Médico</h1>
              <p className="text-sm text-[#6B7280] font-medium mt-1">
                Gestión y visualización del personal de salud registrado.
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar por nombre, documento o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#6B7280]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E5E7EB] border-t-[#2563EB]"></div>
            <p className="text-[#6B7280] font-medium animate-pulse">Cargando directorio...</p>
          </div>
        ) : isError ? (
          <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-200 flex items-center justify-center gap-3">
            <Activity className="w-6 h-6" />
            <span className="font-semibold">Ocurrió un error al cargar la información del personal.</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">
                {filteredPersonal.length} Profesionales Encontrados
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPersonal.map((p) => {
                const tipoDoc = p.tipo_documento || 'ID';
                const numDoc = p.numero_documento || 'No registrado';
                const especialidad = p.especialidad || p.tipo_profesional || 'Profesional General';

                return (
                  <div 
                    key={p.id_personal} 
                    onClick={() => navigate(`/personal/${p.id_personal}`, { state: { nombre: p.nombre_completo } })}
                    className="bg-[#FFFFFF] rounded-3xl shadow-sm border border-[#E5E7EB] p-6 cursor-pointer hover:border-[#2563EB]/30 hover:shadow-lg transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-[#F9FAFB] p-3 rounded-2xl group-hover:bg-blue-50 transition-colors duration-300">
                        <UserCircle className="w-10 h-10 text-[#2563EB]" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-[#16A34A] text-xs font-bold uppercase tracking-wide border border-green-100">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Activo
                      </span>
                    </div>

                    <div className="flex-1 space-y-1.5 mb-6">
                      <h3 className="font-bold text-[#111827] text-lg leading-tight group-hover:text-[#2563EB] transition-colors line-clamp-2">
                        {p.nombre_completo || 'Nombre no registrado'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[#6B7280] text-sm font-medium">
                        <Stethoscope className="w-4 h-4 text-[#2563EB]/70" />
                        <span className="truncate">{especialidad}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-widest">{tipoDoc}</span>
                        <span className="text-sm font-semibold text-[#111827]">{numDoc}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#F9FAFB] flex items-center justify-center group-hover:bg-[#2563EB] transition-colors duration-300">
                        <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredPersonal.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-[#E5E7EB] border-dashed">
                  <div className="bg-[#F9FAFB] p-4 rounded-full mb-4">
                    <Search className="w-8 h-8 text-[#6B7280]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-1">Sin resultados</h3>
                  <p className="text-[#6B7280] font-medium text-center max-w-md">
                    No pudimos encontrar ningún profesional que coincida con tu búsqueda. 
                    Intenta con otros términos.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
