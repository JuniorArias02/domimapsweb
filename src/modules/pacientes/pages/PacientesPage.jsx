import React from 'react';
import { Search, UserPlus, Users, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePacientes } from '../hooks/usePacientes';
import PacienteCard from '../components/PacienteCard';
import PacienteForm from '../components/PacienteForm';

export default function PacientesPage() {
  const {
    pacientesFiltrados,
    isLoading,
    isError,
    isFetching,
    busqueda,
    meta,
    pagina,
    setBusqueda,
    manejarCambioPagina,
    modalAbierto,
    pacienteSeleccionado,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
  } = usePacientes();
  
  console.log(pacientesFiltrados)
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Pacientes</h1>
          <p className="text-[#6B7280] text-sm mt-0.5">
            Gestiona el registro de pacientes del programa domiciliario
          </p>
        </div>
        <button
          id="btn-nuevo-paciente"
          onClick={abrirModalCrear}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#2563EB] rounded-xl hover:bg-[#1E40AF] transition-colors shadow-sm shadow-blue-500/20 flex-shrink-0"
        >
          <UserPlus size={18} />
          Nuevo paciente
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          id="buscador-pacientes"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o identificación..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Estado: cargando */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
          <Loader2 size={24} className="animate-spin text-[#2563EB]" />
          <span className="text-sm font-medium">Cargando pacientes...</span>
        </div>
      )}

      {/* Estado: error */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
          <AlertCircle size={40} className="text-red-400" />
          <p className="text-sm font-bold text-gray-700">No se pudieron cargar los pacientes</p>
          <p className="text-xs text-gray-500">Verifica la conexión con el servidor.</p>
        </div>
      )}

      {/* Grid de Tarjetas */}
      {!isLoading && !isError && (
        <div className="space-y-6">
          {/* Cabecera de control de lista */}
          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#2563EB]" />
              <span className="text-sm font-black text-gray-900 uppercase tracking-tight">
                {busqueda ? 'Resultados de búsqueda' : 'Registro General'}
              </span>
              <span className="px-2 py-0.5 bg-blue-50 text-[#2563EB] text-xs font-black rounded-lg">
                {busqueda ? pacientesFiltrados.length : (meta?.total || 0)}
              </span>
            </div>
            
            {meta && !busqueda && (
              <div className="hidden sm:flex items-center gap-2">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Página {meta.pagina_actual} / {meta.ultima_pagina}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pacientesFiltrados.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-300 p-20 flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Users size={40} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {busqueda ? 'No encontramos coincidencias' : 'Aún no hay pacientes'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs">
                    Intenta ajustar tu búsqueda o registra un nuevo paciente en el botón superior.
                  </p>
                </div>
              </div>
            ) : (
              pacientesFiltrados.map((paciente) => (
                <PacienteCard
                  key={paciente.id_paciente}
                  paciente={paciente}
                  onEditar={abrirModalEditar}
                />
              ))
            )}
          </div>

          {/* Paginación */}
          {meta && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">
                Mostrando <span className="text-gray-900 font-bold">{pacientesFiltrados.length}</span> de <span className="text-gray-900 font-bold">{meta.total}</span> pacientes
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => manejarCambioPagina(meta.pagina_actual - 1)}
                  disabled={meta.pagina_actual === 1 || isFetching}
                  className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(meta.ultima_pagina)].map((_, i) => {
                    const n = i + 1;
                    // Mostrar solo algunas páginas si son muchas
                    if (meta.ultima_pagina > 7 && (n > 2 && n < meta.ultima_pagina - 1 && Math.abs(n - meta.pagina_actual) > 1)) {
                        if (n === 3 || n === meta.ultima_pagina - 1) return <span key={n} className="px-1 text-gray-400">...</span>;
                        return null;
                    }
                    return (
                      <button
                        key={n}
                        onClick={() => manejarCambioPagina(n)}
                        disabled={isFetching}
                        className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                          meta.pagina_actual === n
                            ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => manejarCambioPagina(meta.pagina_actual + 1)}
                  disabled={meta.pagina_actual === meta.ultima_pagina || isFetching}
                  className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal crear/editar */}
      <PacienteForm
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        paciente={pacienteSeleccionado}
      />
    </div>
  );
}
