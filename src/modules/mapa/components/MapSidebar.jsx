import React from 'react';
import { Users, ChevronLeft, Layers, BriefcaseMedical, Building2, Globe, Zap } from 'lucide-react';
import { useMapaStore, MENU_IDS } from '../store/mapaStore';

export default function MapSidebar() {
  const {
    isMapSidebarOpen,
    toggleMapSidebar,
    mostrarPacientes,
    toggleMostrarPacientes,
    mostrarProfesionales,
    toggleMostrarProfesionales,
    mostrarRutasGlobales,
    toggleRutasGlobalesMenu,
    mostrarOptimizador,
    toggleOptimizadorMenu,
    toggleComunasMenu,
    activeMenuId,
    tipoVistaPacientes,
    setTipoVistaPacientes
  } = useMapaStore();

  // Estados derivados para claridad visual
  const isPacientesActive = mostrarPacientes;
  const isProfesionalesActive = mostrarProfesionales;
  const isRutasGlobalActive = mostrarRutasGlobales;
  const isComunasActive = activeMenuId === MENU_IDS.COMUNAS;

  return (
    <div
      className={`absolute top-0 bottom-0 left-0 w-80 bg-white shadow-2xl z-[400] transition-all duration-300 flex flex-col border-r border-gray-100 ${isMapSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* Toggle Button (Google Maps Style) */}
      <button
        onClick={toggleMapSidebar}
        className="absolute -right-10 top-6 w-10 h-14 bg-white border border-gray-200 border-l-0 rounded-r-xl shadow-md flex items-center justify-center text-gray-400 hover:text-[#2563EB] hover:bg-gray-50 focus:outline-none transition-all group"
        title={isMapSidebarOpen ? "Cerrar opciones" : "Opciones del mapa"}
      >
        <div className="transition-transform duration-300 group-hover:scale-110">
          {isMapSidebarOpen ? <ChevronLeft size={24} /> : <Layers size={22} />}
        </div>
      </button>

      {/* Header Section */}
      <div className="px-7 py-6 border-b border-gray-50 bg-[#F9FAFB]/50">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Layers size={14} className="text-[#2563EB]" />
          </div>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
            Capas y Filtros
          </h2>
        </div>
        <h3 className="text-xl font-black text-gray-900 tracking-tight">Panel de Control</h3>
      </div>

      {/* Controls Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        <div className="space-y-4">

          {/* Section Label */}
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-3 mb-2">Visibilidad</p>

          {/* Control: Mostrar Pacientes */}
          <div className="space-y-1">
            <div
              onClick={toggleMostrarPacientes}
              className={`flex items-center justify-between cursor-pointer group p-3.5 rounded-2xl border transition-all duration-300 ${isPacientesActive
                  ? 'bg-blue-50/50 border-blue-100 shadow-sm shadow-blue-500/5'
                  : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${isPacientesActive
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30 rotate-0'
                    : 'bg-gray-100 text-gray-400 rotate-[-10deg] group-hover:rotate-0 group-hover:bg-gray-200'
                  }`}>
                  <Users size={22} />
                </div>
                <div>
                  <span className={`block text-sm font-black transition-colors ${isPacientesActive ? 'text-[#2563EB]' : 'text-gray-700'
                    }`}>
                    Pacientes
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium block mt-0.5 leading-none">
                    Ver red de domicilios
                  </span>
                </div>
              </div>

              {/* Custom Switch */}
              <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isPacientesActive ? 'bg-[#2563EB]' : 'bg-gray-200'
                }`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${isPacientesActive ? 'left-6' : 'left-1'
                  }`}></div>
              </div>
            </div>

            {/* Sub-opciones de Pacientes (Aislado para mejor UX) */}
            {isPacientesActive && (
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-50/50 rounded-2xl border border-gray-100 mt-1 mx-1 animate-in slide-in-from-top-2 duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTipoVistaPacientes('GENERAL');
                  }}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${tipoVistaPacientes === 'GENERAL'
                      ? 'bg-white text-[#2563EB] shadow-sm border border-blue-100'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  General
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTipoVistaPacientes('POR_COMUNA');
                  }}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${tipoVistaPacientes === 'POR_COMUNA'
                      ? 'bg-white text-[#2563EB] shadow-sm border border-blue-100'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Por Comuna
                </button>
              </div>
            )}
          </div>

          {/* Control: Mostrar Profesionales */}
          <div
            onClick={toggleMostrarProfesionales}
            className={`flex items-center justify-between cursor-pointer group p-3.5 rounded-2xl border transition-all duration-300 mt-2 ${isProfesionalesActive
                ? 'bg-emerald-50/50 border-emerald-100 shadow-sm shadow-emerald-500/5'
                : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${isProfesionalesActive
                  ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/30 rotate-0'
                  : 'bg-gray-100 text-gray-400 rotate-[-10deg] group-hover:rotate-0 group-hover:bg-gray-200'
                }`}>
                <BriefcaseMedical size={22} />
              </div>
              <div>
                <span className={`block text-sm font-black transition-colors ${isProfesionalesActive ? 'text-[#10B981]' : 'text-gray-700'
                  }`}>
                  Profesionales
                </span>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5 leading-none">
                  Ver equipo médico
                </span>
              </div>
            </div>

            {/* Custom Switch */}
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isProfesionalesActive ? 'bg-[#10B981]' : 'bg-gray-200'
              }`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${isProfesionalesActive ? 'left-6' : 'left-1'
                }`}></div>
            </div>
          </div>

          {/* Control: Mostrar Comunas */}
          <div
            onClick={toggleComunasMenu}
            className={`flex items-center justify-between cursor-pointer group p-3.5 rounded-2xl border transition-all duration-300 mt-2 ${isComunasActive
                ? 'bg-purple-50/50 border-purple-100 shadow-sm shadow-purple-500/5'
                : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${isComunasActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 rotate-0'
                  : 'bg-gray-100 text-gray-400 rotate-[-10deg] group-hover:rotate-0 group-hover:bg-gray-200'
                }`}>
                <Building2 size={22} />
              </div>
              <div>
                <span className={`block text-sm font-black transition-colors ${isComunasActive ? 'text-purple-600' : 'text-gray-700'
                  }`}>
                  Comunas
                </span>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5 leading-none">
                  Delimitación urbana
                </span>
              </div>
            </div>

            {/* Custom Switch Indicator */}
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isComunasActive ? 'bg-purple-600' : 'bg-gray-200'
              }`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${isComunasActive ? 'left-6' : 'left-1'
                }`}></div>
            </div>
          </div>

          {/* Control: Rutas Globales */}
          <div
            onClick={toggleRutasGlobalesMenu}
            className={`flex items-center justify-between cursor-pointer group p-3.5 rounded-2xl border transition-all duration-300 mt-2 ${isRutasGlobalActive
                ? 'bg-blue-50/50 border-blue-100 shadow-sm shadow-blue-500/5'
                : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${isRutasGlobalActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 rotate-0'
                  : 'bg-gray-100 text-gray-400 rotate-[-10deg] group-hover:rotate-0 group-hover:bg-gray-200'
                }`}>
                <Globe size={22} />
              </div>
              <div>
                <span className={`block text-sm font-black transition-colors ${isRutasGlobalActive ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                  Ruta Paciente
                </span>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5 leading-none">
                  Optimización Global
                </span>
              </div>
            </div>

            {/* Custom Switch Indicator */}
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isRutasGlobalActive ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${isRutasGlobalActive ? 'left-6' : 'left-1'
                }`}></div>
            </div>
          </div>

          {/* Control: Optimizador Proyectado */}
          <div
            onClick={toggleOptimizadorMenu}
            className={`flex items-center justify-between cursor-pointer group p-3.5 rounded-2xl border transition-all duration-300 mt-2 ${mostrarOptimizador
                ? 'bg-amber-50/50 border-amber-100 shadow-sm shadow-amber-500/5'
                : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${mostrarOptimizador
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 rotate-0'
                  : 'bg-gray-100 text-gray-400 rotate-[-10deg] group-hover:rotate-0 group-hover:bg-gray-200'
                }`}>
                <Zap size={22} />
              </div>
              <div>
                <span className={`block text-sm font-black transition-colors ${mostrarOptimizador ? 'text-amber-600' : 'text-gray-700'
                  }`}>
                  Optimizador
                </span>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5 leading-none">
                  Frecuencia y Cercanía
                </span>
              </div>
            </div>

            {/* Custom Switch Indicator */}
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${mostrarOptimizador ? 'bg-amber-500' : 'bg-gray-200'
              }`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${mostrarOptimizador ? 'left-6' : 'left-1'
                }`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );

}
