import React, { useState, useRef, useEffect } from 'react';
import { useCrearAgenda } from '../queries/useCrearAgenda';
import { usePacientesBusqueda } from '../queries/usePacientesBusqueda';
import { usePersonalBusqueda } from '../queries/usePersonalBusqueda';
import { AgendaPayload } from '../types/agendaPayload';
import { 
  Calendar, User, Stethoscope, Hash, Clock, 
  CheckCircle, AlertTriangle, Loader2, Search, X 
} from 'lucide-react';

/**
 * Capa de Presentación (UI/Components)
 * Componente funcional para el formulario de Creación de Agenda.
 */
export const CrearAgendaForm = () => {
  const { mutate, isPending } = useCrearAgenda();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados para el buscador de pacientes
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{id: number, nombre: string} | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading: isSearching } = usePacientesBusqueda(searchQuery);

  // Estados para el buscador de personal
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [showStaffResults, setShowStaffResults] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<{id: number, nombre: string} | null>(null);
  const dropdownStaffRef = useRef<HTMLDivElement>(null);

  const { data: staffResults, isLoading: isSearchingStaff } = usePersonalBusqueda(staffSearchQuery);

  const [formData, setFormData] = useState<AgendaPayload>({
    id_paciente: '' as any as number,
    id_especialidad: '' as any as number,
    numero_sesiones: 10,
    frecuencia_dias: 3,
    fecha_inicio: new Date().toISOString().split('T')[0],
    id_personal: '' as any as number,
  });

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (dropdownStaffRef.current && !dropdownStaffRef.current.contains(event.target as Node)) {
        setShowStaffResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPatient = (paciente: any) => {
    setSelectedPatient({ id: paciente.id_paciente, nombre: paciente.nombre_completo });
    setFormData(prev => ({ ...prev, id_paciente: paciente.id_paciente }));
    setSearchQuery('');
    setShowResults(false);
  };

  const handleSelectStaff = (personal: any) => {
    setSelectedStaff({ id: personal.id_personal, nombre: personal.nombre_completo });
    setFormData(prev => ({ ...prev, id_personal: personal.id_personal }));
    setStaffSearchQuery('');
    setShowStaffResults(false);
  };

  const clearSelection = () => {
    setSelectedPatient(null);
    setFormData(prev => ({ ...prev, id_paciente: '' as any as number }));
  };

  const clearStaffSelection = () => {
    setSelectedStaff(null);
    setFormData(prev => ({ ...prev, id_personal: '' as any as number }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : '') : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_paciente) {
      setErrorMsg('Debe seleccionar un paciente de la lista.');
      return;
    }
    setSuccess(false);
    setErrorMsg(null);

    const cleanPayload: AgendaPayload = {
      id_paciente: Number(formData.id_paciente),
      id_especialidad: Number(formData.id_especialidad),
      numero_sesiones: Number(formData.numero_sesiones),
      frecuencia_dias: Number(formData.frecuencia_dias),
      fecha_inicio: formData.fecha_inicio,
    };

    if (formData.id_personal && String(formData.id_personal).trim() !== '') {
      cleanPayload.id_personal = Number(formData.id_personal);
    } else {
      cleanPayload.id_personal = null;
    }

    mutate(cleanPayload, {
      onSuccess: () => {
        setSuccess(true);
        setSelectedPatient(null);
        setSelectedStaff(null);
        setFormData(prev => ({
          ...prev,
          id_paciente: '' as any as number,
          id_personal: '' as any as number
        }));
      },
      onError: (err: any) => {
        if (err.response?.status === 422) {
          setErrorMsg(err.response?.data?.message || 'Error de validación en los datos provistos (422).');
        } else {
          setErrorMsg(err.message || 'Ocurrió un error inesperado al crear la agenda.');
        }
      },
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden mt-6">
      <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <Calendar className="text-[#2563EB]" /> Agendar Visitas Domiciliarias
          </h2>
          <p className="text-[#6B7280] text-sm mt-1">Configura las sesiones periódicas para el paciente seleccionado.</p>
        </div>
      </div>

      <div className="p-6">
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-3 text-green-700 font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="text-green-600" />
            Las sesiones han sido agendadas exitosamente (Código 201).
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 font-medium animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="text-red-500" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Buscador de Paciente */}
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1" htmlFor="search_paciente">
                Paciente *
              </label>
              
              {!selectedPatient ? (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB]">
                    {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  </div>
                  <input
                    id="search_paciente"
                    type="text"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[#111827] font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all outline-none"
                    placeholder="Escriba nombre o identificación..."
                  />
                  
                  {showResults && searchQuery.length >= 2 && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
                      {isSearching && <div className="p-4 text-center text-gray-400 text-xs font-bold uppercase">Buscando...</div>}
                      {!isSearching && searchResults?.data?.length === 0 && <div className="p-4 text-center text-gray-400 text-xs font-bold uppercase">No se encontraron resultados</div>}
                      {!isSearching && searchResults?.data?.map((paciente: any) => (
                        <button
                          key={paciente.id_paciente}
                          type="button"
                          onClick={() => handleSelectPatient(paciente)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex flex-col border-b border-gray-50 last:border-0"
                        >
                          <span className="text-sm font-black text-gray-900 uppercase leading-none">{paciente.nombre_completo}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">ID: {paciente.identificacion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl text-blue-600 shadow-sm"><User size={18} /></div>
                    <div>
                      <p className="text-xs font-black text-blue-700 uppercase leading-none">{selectedPatient.nombre}</p>
                      <p className="text-[9px] font-bold text-blue-400 uppercase mt-1">Seleccionado</p>
                    </div>
                  </div>
                  <button type="button" onClick={clearSelection} className="p-1.5 hover:bg-white rounded-lg text-blue-400 hover:text-red-500 transition-all"><X size={16} /></button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1" htmlFor="id_especialidad">
                Especialidad *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB]">
                  <Stethoscope size={18} />
                </div>
                <select
                  id="id_especialidad" name="id_especialidad" required
                  value={formData.id_especialidad} onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[#111827] font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Seleccione una especialidad</option>
                  <option value="1">Medicina General (1)</option>
                  <option value="2">Enfermería (2)</option>
                  <option value="3">Fisioterapia (3)</option>
                  <option value="4">Terapia Ocupacional (4)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1" htmlFor="numero_sesiones">
                Número de Sesiones *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB]">
                  <Hash size={18} />
                </div>
                <input
                  id="numero_sesiones" name="numero_sesiones" type="number" min="1" required
                  value={formData.numero_sesiones} onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[#111827] font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1" htmlFor="frecuencia_dias">
                Frecuencia (En Días) *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB]">
                  <Clock size={18} />
                </div>
                <input
                  id="frecuencia_dias" name="frecuencia_dias" type="number" min="0" required
                  value={formData.frecuencia_dias} onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[#111827] font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1" htmlFor="fecha_inicio">
                Fecha de Inicio *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB]">
                  <Calendar size={18} />
                </div>
                <input
                  id="fecha_inicio" name="fecha_inicio" type="date" required
                  value={formData.fecha_inicio} onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[#111827] font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Buscador de Personal (Opcional) */}
            <div className="space-y-2 relative" ref={dropdownStaffRef}>
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1" htmlFor="search_staff">
                Personal (Opcional)
              </label>
              
              {!selectedStaff ? (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB]">
                    {isSearchingStaff ? <Loader2 size={18} className="animate-spin" /> : <User size={18} />}
                  </div>
                  <input
                    id="search_staff"
                    type="text"
                    autoComplete="off"
                    value={staffSearchQuery}
                    onChange={(e) => {
                      setStaffSearchQuery(e.target.value);
                      setShowStaffResults(true);
                    }}
                    onFocus={() => setShowStaffResults(true)}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[#111827] font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all outline-none"
                    placeholder="Escriba nombre o cédula..."
                  />
                  
                  {showStaffResults && staffSearchQuery.length >= 2 && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
                      {isSearchingStaff && <div className="p-4 text-center text-gray-400 text-xs font-bold uppercase">Buscando...</div>}
                      {!isSearchingStaff && staffResults?.data?.length === 0 && <div className="p-4 text-center text-gray-400 text-xs font-bold uppercase">No se encontraron resultados</div>}
                      {!isSearchingStaff && staffResults?.data?.map((p: any) => (
                        <button
                          key={p.id_personal}
                          type="button"
                          onClick={() => handleSelectStaff(p)}
                          className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex flex-col border-b border-gray-50 last:border-0"
                        >
                          <span className="text-sm font-black text-gray-900 uppercase leading-none">{p.nombre_completo}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">{p.tipo_documento}: {p.numero_documento}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl text-orange-600 shadow-sm"><User size={18} /></div>
                    <div>
                      <p className="text-xs font-black text-orange-700 uppercase leading-none">{selectedStaff.nombre}</p>
                      <p className="text-[9px] font-bold text-orange-400 uppercase mt-1">Personal Asignado</p>
                    </div>
                  </div>
                  <button type="button" onClick={clearStaffSelection} className="p-1.5 hover:bg-white rounded-lg text-orange-400 hover:text-red-500 transition-all"><X size={16} /></button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit" disabled={isPending}
              className="flex items-center justify-center py-3.5 px-8 bg-[#2563EB] hover:bg-[#1E40AF] disabled:bg-[#2563EB]/60 text-white font-bold rounded-2xl shadow-lg shadow-[#2563EB]/25 active:scale-[0.98] transition-all duration-200 group"
            >
              {isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Agendando...</>
              ) : 'Confirmar Agenda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
