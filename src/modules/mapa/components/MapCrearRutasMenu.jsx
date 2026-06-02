import React, { useState, useRef, useEffect } from 'react';
import { useMapaStore, MENU_IDS } from '../store/mapaStore';
import { useVisitasProgramadasQuery } from '../queries/useVisitasProgramadasQuery';
import { useServiciosQuery } from '../queries/useServiciosQuery';
import { useCrearRutaMutation } from '../queries/useCrearRutaMutation';
import { usePersonalQuery } from '../../personal/queries/usePersonalQuery';
import { 
  X, Search, Filter, ChevronLeft, ChevronRight, 
  MapPin, Minimize2, Power, Calendar, User, Check,
  ChevronDown, Activity, Route, CheckSquare, Square,
  Save
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function MapCrearRutasMenu() {
  const { 
    isMapSidebarOpen,
    mostrarCrearRutas,
    activeMenuId,
    setActiveMenu,
    crearRutasFilters,
    setCrearRutasFilters,
    toggleCrearRutasMenu,
    selectedVisitasIds,
    clearSelectedVisitas,
    setSelectedVisitas
  } = useMapaStore();

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'No registrada';
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        const [year, month, day] = fechaStr.split('-');
        return `${day}/${month}/${year}`;
      }

      const date = new Date(fechaStr.replace(' ', 'T'));
      if (isNaN(date.getTime())) return fechaStr;

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      if (fechaStr.includes(' ') || fechaStr.includes('T')) {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        const hoursStr = String(hours).padStart(2, '0');
        return `${day}/${month}/${year} ${hoursStr}:${minutes} ${period}`;
      }
      return `${day}/${month}/${year}`;
    } catch {
      return fechaStr;
    }
  };

  const isMenuOpen = activeMenuId === MENU_IDS.CREAR_RUTAS;
 
  // State for Route Creation Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [routeDate, setRouteDate] = useState('');
  const [modalPersonalId, setModalPersonalId] = useState('');
  const [isModalDropdownOpen, setIsModalDropdownOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const modalDropdownRef = useRef(null);

  const createRouteMutation = useCrearRutaMutation();

  const { data: visitasResult, isLoading, isFetching, isError } = useVisitasProgramadasQuery();
  const { data: serviciosData, isLoading: isLoadingServicios } = useServiciosQuery();
  const { data: personalResult, isLoading: isLoadingPersonal } = usePersonalQuery();
  
  const visits = visitasResult?.data || [];
  const servicios = serviciosData?.data || serviciosData || [];
  const personalList = personalResult?.data || [];

  const selectedVisitsDetails = visits.filter(v => selectedVisitasIds.includes(v.id_visita));

  const modalFilteredPersonal = personalList.filter(p => 
    p.nombre_completo.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    p.id_personal.toString().includes(modalSearchTerm)
  );

  const modalProfesionalSeleccionado = personalList.find(p => String(p.id_personal) === String(modalPersonalId));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalDropdownRef.current && !modalDropdownRef.current.contains(event.target)) {
        setIsModalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMesChange = (increment) => {
    let newMes = crearRutasFilters.mes + increment;
    let newAnio = crearRutasFilters.anio;

    if (newMes > 12) {
      newMes = 1;
      newAnio += 1;
    } else if (newMes < 1) {
      newMes = 12;
      newAnio -= 1;
    }

    setCrearRutasFilters({ mes: newMes, anio: newAnio });
  };

  const handleSelectAll = () => {
    const first8Ids = visits.slice(0, 8).map(v => v.id_visita);
    setSelectedVisitas(first8Ids);
  };

  const handleClearSelection = () => {
    clearSelectedVisitas();
  };

  const handleToggleVisita = (id) => {
    const isSelected = selectedVisitasIds.includes(id);
    if (!isSelected && selectedVisitasIds.length >= 8) {
      return;
    }
    
    let newSelected;
    if (isSelected) {
      newSelected = selectedVisitasIds.filter(vId => vId !== id);
    } else {
      newSelected = [...selectedVisitasIds, id];
    }
    setSelectedVisitas(newSelected);
  };

  const handleCreateRouteAction = () => {
    if (selectedVisitasIds.length === 0) return;

    // Pre-fill date from the first selected visit
    if (selectedVisitsDetails.length > 0) {
      const firstVisit = selectedVisitsDetails[0];
      if (firstVisit && firstVisit.fecha_programada) {
        const dateMatch = firstVisit.fecha_programada.match(/^\d{4}-\d{2}-\d{2}/);
        if (dateMatch) {
          setRouteDate(dateMatch[0]);
        } else {
          setRouteDate(new Date().toISOString().split('T')[0]);
        }
      }
    } else {
      setRouteDate(new Date().toISOString().split('T')[0]);
    }

    setModalPersonalId(''); // Reset professional selection in modal
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSaveRoute = () => {
    if (!modalPersonalId) {
      Swal.fire({
        title: 'Seleccione un Profesional',
        text: 'Debe asignar un profesional para poder crear la ruta.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
          confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
        },
        buttonsStyling: false
      });
      return;
    }

    // Build the request payload matching the database schema structure
    const payload = {
      id_personal: Number(modalPersonalId),
      fecha_ruta: routeDate,
      visitas: selectedVisitasIds.map((id, index) => ({
        id_visita: Number(id),
        orden_visita: index + 1
      }))
    };

    createRouteMutation.mutate(payload, {
      onSuccess: (data) => {
        Swal.fire({
          title: '¡Ruta Creada con Éxito!',
          html: `
            <div class="text-left font-sans space-y-3 text-xs leading-relaxed text-gray-650">
              <p>La ruta ha sido registrada exitosamente en el servidor.</p>
              <div class="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1.5 font-mono text-[10px]">
                <div><span class="font-bold text-indigo-650">ID de Ruta Creada:</span> <span class="font-bold text-gray-800">${data?.data?.id_ruta || data?.id_ruta || 'N/A'}</span></div>
                <div>• id_personal: <span class="font-bold text-gray-800">${modalPersonalId}</span> (${modalProfesionalSeleccionado?.nombre_completo})</div>
                <div>• fecha_ruta: <span class="font-bold text-gray-800">${routeDate}</span></div>
                <div>• estado: <span class="font-bold text-green-600">'EN_DISENO'</span></div>
              </div>
              
              <div class="mt-3">
                <span class="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Payload JSON de la Petición:</span>
                <pre class="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] overflow-x-auto select-all max-h-36 custom-scrollbar">${JSON.stringify(payload, null, 2)}</pre>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Entendido',
          customClass: {
            popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8 max-w-lg',
            confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer w-full mt-2',
          },
          buttonsStyling: false
        });

        clearSelectedVisitas();
        setIsConfirmModalOpen(false);
      },
      onError: (error) => {
        Swal.fire({
          title: 'Error al Crear Ruta',
          text: error?.response?.data?.message || error?.message || 'Ocurrió un error inesperado al intentar registrar la ruta.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          customClass: {
            popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
            confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
          },
          buttonsStyling: false
        });
      }
    });
  };

  if (!mostrarCrearRutas) return null;

  return (
    <div 
      className={`absolute top-20 bottom-0 w-98 bg-[#F9FAFB] shadow-2xl z-[390] transition-all duration-300 flex flex-col border-l border-gray-100 ${
        isMapSidebarOpen ? 'left-80' : 'left-0'
      } ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Tab toggle handle when minimized */}
      <button
        onClick={() => setActiveMenu(MENU_IDS.CREAR_RUTAS)}
        className={`absolute top-36 w-10 h-14 bg-white border border-gray-200 border-l-0 rounded-r-xl shadow-md flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all duration-300 ${
          isMenuOpen ? 'opacity-0 -right-5 pointer-events-none' : 'opacity-100 -right-10'
        }`}
        title="Creación de Rutas"
      >
        <Filter size={20} />
      </button>

      {/* Header */}
      <div className={`px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Route size={20} className="text-indigo-600" />
            Crear Rutas
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Visitas Programadas</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setActiveMenu(null)}
            title="Minimizar panel"
            className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-xl hover:bg-indigo-50"
          >
            <Minimize2 size={18} />
          </button>
          <button 
            onClick={toggleCrearRutasMenu}
            title="Desactivar capa de creación"
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
          >
            <Power size={18} />
          </button>
        </div>
      </div>

      {/* Filters Form Area */}
      <div className={`p-6 bg-white border-b border-gray-100 space-y-4 transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        
        {/* Date Selector */}
        <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
          <button 
            onClick={() => handleMesChange(-1)}
            className="p-2 hover:bg-white rounded-xl hover:shadow-sm text-gray-500 transition-all active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="text-center">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Periodo</span>
            <span className="text-xs font-black text-gray-800 uppercase">
              {new Date(crearRutasFilters.anio, crearRutasFilters.mes - 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <button 
            onClick={() => handleMesChange(1)}
            className="p-2 hover:bg-white rounded-xl hover:shadow-sm text-gray-500 transition-all active:scale-90"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Medical Service Selector */}
        <div className="relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Servicio Médico</label>
          <div className="relative group">
            <select
              name="id_servicio"
              value={crearRutasFilters.id_servicio || ''}
              onChange={(e) => setCrearRutasFilters({ id_servicio: e.target.value })}
              className="w-full text-[12px] font-black p-3.5 pl-11 pr-10 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all text-gray-700 appearance-none cursor-pointer hover:border-gray-200"
            >
              <option value="">Todos los Servicios</option>
              {servicios.map((serv) => (
                <option key={serv.id_servicio} value={serv.id_servicio}>
                  {serv.codigo_servicio} - {serv.nombre_servicio}
                </option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 group-focus-within:scale-110 transition-transform">
              <Activity size={18} />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
              <ChevronDown size={18} />
            </div>
            {isLoadingServicios && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Helper message for patient selection */}
        <div className="bg-indigo-50/40 border border-indigo-100/50 p-4 rounded-2xl flex items-start gap-2.5">
          <Route size={18} className="text-indigo-600 mt-0.5" />
          <div className="text-[11px] text-indigo-800 font-bold leading-normal">
            Seleccione hasta 8 pacientes de la lista para diseñar la ruta. Al presionar "Crear Ruta" podrá asignar el profesional y la fecha.
          </div>
        </div>

      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50/30">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Visitas Programadas {visits.length ? `(${visits.length})` : ''}
          </span>
          
          <div className="flex items-center gap-2">
            {(isLoading || isFetching) && (
              <div className="flex items-center gap-1.5 mr-2">
                <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[9px] font-black text-indigo-500 uppercase">Cargando</span>
              </div>
            )}
            
            {visits.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={handleSelectAll}
                  className="text-[9px] font-black text-indigo-600 hover:underline uppercase"
                >
                  Seleccionar Todo
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={handleClearSelection}
                  className="text-[9px] font-black text-red-500 hover:underline uppercase"
                >
                  Limpiar Seleccion
                </button>
              </div>
            )}
          </div>
        </div>

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-xs font-bold border border-red-100">
            Error al consultar visitas programadas
          </div>
        )}

        {!isLoading && !isError && visits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <User size={48} className="text-gray-300 mb-3" />
            <p className="text-[10px] font-bold text-gray-500 px-10 leading-relaxed uppercase tracking-widest">
              No se encontraron visitas programadas para los filtros seleccionados
            </p>
          </div>
        )}

        {/* Visitas List */}
        <div className="flex flex-col gap-3">
          {visits.map((visita) => {
            const isSelected = selectedVisitasIds.includes(visita.id_visita);
            const isLocked = !isSelected && selectedVisitasIds.length >= 8;
            return (
              <div 
                key={visita.id_visita} 
                onClick={() => handleToggleVisita(visita.id_visita)}
                className={`bg-white border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/10' 
                    : isLocked
                      ? 'border-gray-200 bg-gray-50/50 opacity-60 cursor-not-allowed'
                      : 'border-gray-100 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 transition-colors ${
                    isSelected 
                      ? 'text-indigo-600' 
                      : isLocked 
                        ? 'text-gray-200' 
                        : 'text-gray-300 group-hover:text-gray-400'
                  }`}>
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-[11px] font-black text-gray-900 uppercase leading-[1.3] truncate mb-1">
                      {visita.paciente}
                    </h4>
                    
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase mt-0.5">
                      <MapPin size={10} className="text-gray-400" />
                      <span className="truncate">{visita.direccion}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                      <Activity size={10} className="text-gray-400" />
                      <span className="truncate">{visita.codigo_servicio} - {visita.nombre_servicio}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <span className="text-[8px] font-black uppercase text-gray-400">
                        Prof: <span className="text-gray-700 font-bold">{visita.nombre_profesional || 'Sin asignar'}</span>
                      </span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {formatFecha(visita.fecha_programada)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      {selectedVisitasIds.length > 0 && (
        <div className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleCreateRouteAction}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-black uppercase text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Route size={18} />
            Crear Ruta ({selectedVisitasIds.length} Seleccionados)
          </button>
        </div>
      )}

      {/* Modal de Confirmación de Ruta */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setIsConfirmModalOpen(false)} 
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Route size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase">Configurar y Confirmar Ruta</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Detalles de asignación final</p>
                </div>
              </div>
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1.5 hover:bg-gray-200/60 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              
              {/* Searchable Select for Professional in Modal */}
              <div className="relative space-y-2" ref={modalDropdownRef}>
                <div className="flex items-center justify-between mb-1 ml-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    Asignar Profesional (id_personal)
                  </label>
                  {modalPersonalId && (
                    <button 
                      onClick={() => setModalPersonalId('')}
                      className="text-[9px] font-black text-red-500 uppercase hover:underline"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <div 
                    onClick={() => setIsModalDropdownOpen(!isModalDropdownOpen)}
                    className="w-full text-xs font-black p-3.5 pl-11 pr-10 bg-gray-50 border border-gray-150 rounded-2xl transition-all text-gray-700 cursor-pointer hover:border-gray-200 flex items-center min-h-[50px] outline-none"
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600">
                      <User size={18} />
                    </div>
                    <span className={`truncate ${modalProfesionalSeleccionado ? 'text-gray-900 font-black' : 'text-gray-400 font-bold'}`}>
                      {modalProfesionalSeleccionado?.nombre_completo || 'Buscar profesional para la ruta...'}
                    </span>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <ChevronDown size={18} className={`transition-transform duration-300 ${isModalDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isModalDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[1000] max-h-56 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2 border-b border-gray-50 bg-gray-50/50 bg-white">
                        <input 
                          autoFocus
                          type="text"
                          placeholder="Escriba nombre o documento..."
                          value={modalSearchTerm}
                          onChange={(e) => setModalSearchTerm(e.target.value)}
                          className="w-full text-xs font-bold p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all placeholder-gray-400 text-gray-700"
                        />
                      </div>
                      <div className="overflow-y-auto flex-1 custom-scrollbar max-h-40">
                        {isLoadingPersonal ? (
                          <div className="p-8 text-center bg-white">
                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Cargando personal...</span>
                          </div>
                        ) : modalFilteredPersonal.length > 0 ? (
                          modalFilteredPersonal.map((p) => (
                            <div 
                              key={p.id_personal}
                              onClick={() => {
                                setModalPersonalId(p.id_personal);
                                setIsModalDropdownOpen(false);
                                setModalSearchTerm('');
                              }}
                              className={`p-3 px-4 flex items-center justify-between cursor-pointer transition-all hover:bg-indigo-50 group/item bg-white border-b border-gray-50 last:border-b-0 ${String(modalPersonalId) === String(p.id_personal) ? 'bg-indigo-50/50' : ''}`}
                            >
                              <div className="flex flex-col">
                                <span className={`text-xs font-black uppercase ${String(modalPersonalId) === String(p.id_personal) ? 'text-indigo-600' : 'text-gray-700'} group-hover/item:text-indigo-700`}>
                                  {p.nombre_completo}
                                </span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">ID: {p.id_personal} | {p.tipo_documento}: {p.numero_documento || 'N/A'}</span>
                              </div>
                              {String(modalPersonalId) === String(p.id_personal) && (
                                <Check size={16} className="text-indigo-500" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-400 text-[10px] font-bold uppercase italic tracking-widest leading-relaxed bg-white">
                            No se encontraron<br/>profesionales
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                  Fecha de la Ruta (fecha_ruta)
                </label>
                <div className="relative">
                  <input 
                    type="date"
                    value={routeDate}
                    onChange={(e) => setRouteDate(e.target.value)}
                    className="w-full text-xs font-black p-3.5 pl-11 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all text-gray-700"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
                    <Calendar size={18} />
                  </div>
                </div>
              </div>

              {/* Initial State / Estado */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-150/50">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                  Estado Inicial
                </span>
                <span className="text-[9px] font-black px-2.5 py-1 rounded-md uppercase bg-amber-50 text-amber-700 border border-amber-200">
                  EN_DISENO
                </span>
              </div>

              {/* Visitas List */}
              <div className="space-y-2.5">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                  Paradas de la Ruta (visitas_domiciliarias - orden_visita)
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {selectedVisitsDetails.map((visita, index) => (
                    <div 
                      key={visita.id_visita} 
                      className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3 hover:border-gray-200 transition-all"
                    >
                      {/* Order indicator */}
                      <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase truncate leading-tight">
                          {visita.paciente}
                        </h4>
                        <div className="flex items-center gap-1 text-[8px] font-bold text-gray-400 uppercase mt-0.5 truncate">
                          <MapPin size={8} />
                          <span>{visita.direccion}</span>
                        </div>
                      </div>

                      {/* Service badge */}
                      <span className="text-[8px] font-black px-2 py-0.5 rounded bg-gray-50 border border-gray-150 text-gray-500 uppercase flex-shrink-0">
                        {visita.codigo_servicio}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/30">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm font-black uppercase text-[10px] tracking-wider transition-all active:scale-95 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSaveRoute}
                disabled={createRouteMutation.isPending}
                className={`px-6 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-black uppercase text-[10px] tracking-wider transition-all flex items-center gap-2 active:scale-95 ${createRouteMutation.isPending ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {createRouteMutation.isPending ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={14} />
                )}
                {createRouteMutation.isPending ? 'Creando...' : 'Confirmar y Crear'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
