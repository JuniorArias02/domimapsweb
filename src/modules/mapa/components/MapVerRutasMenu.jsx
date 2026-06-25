import React, { useState } from 'react';
import { useMapaStore, MENU_IDS } from '../store/mapaStore';
import { useRutasQuery } from '../queries/useRutasQuery';
import { useDetalleRutaQuery } from '../queries/useDetalleRutaQuery';
import { 
  X, Search, Minimize2, Power, Route, Map, User, Calendar, 
  ArrowLeft, MapPin, Activity, CheckCircle, ClipboardList, Info,
  Trash2, CheckSquare
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useEliminarRutaMutation } from '../queries/useEliminarRutaMutation';
import { useAsignarRutaMutation } from '../queries/useAsignarRutaMutation';

export default function MapVerRutasMenu() {
  const { 
    isMapSidebarOpen,
    mostrarVerRutas,
    activeMenuId,
    setActiveMenu,
    toggleVerRutasMenu,
    selectedRutaId,
    setSelectedRutaId,
    seleccionarPaciente
  } = useMapaStore();

  const isMenuOpen = activeMenuId === MENU_IDS.VER_RUTAS || activeMenuId === MENU_IDS.DETALLE_RUTA;
  const isDetailOpen = activeMenuId === MENU_IDS.DETALLE_RUTA;

  // Search filter inside the routes list
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch routes list
  const { data: rutasResult, isLoading: loadingList, isError: listError } = useRutasQuery();
  // Fetch detailed route if selected
  const { data: detailResult, isLoading: loadingDetail, isError: detailError } = useDetalleRutaQuery(selectedRutaId);

  const eliminarRutaMutation = useEliminarRutaMutation();
  const asignarRutaMutation = useAsignarRutaMutation();

  const handleEliminar = (id) => {
    Swal.fire({
      title: '¿Eliminar Ruta?',
      text: 'Esta acción desvinculará las visitas, que quedarán disponibles nuevamente. No se puede eliminar una ruta finalizada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
        cancelButton: 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all active:scale-95 cursor-pointer',
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarRutaMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire({
              title: 'Eliminada',
              text: 'La ruta ha sido eliminada correctamente.',
              icon: 'success',
              confirmButtonText: 'Entendido',
              customClass: {
                popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
                confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
              },
              buttonsStyling: false
            });
            setSelectedRutaId(null);
          },
          onError: (error) => {
            Swal.fire({
              title: 'Error',
              text: error?.response?.data?.message || 'No se pudo eliminar la ruta.',
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
      }
    });
  };

  const handleAsignar = (id) => {
    Swal.fire({
      title: '¿Confirmar Diseño?',
      text: 'La ruta pasará a estado ASIGNADA y estará lista para su ejecución.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
        confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
        cancelButton: 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all active:scale-95 cursor-pointer',
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        asignarRutaMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire({
              title: 'Confirmada',
              text: 'La ruta ahora está en estado ASIGNADA.',
              icon: 'success',
              confirmButtonText: 'Entendido',
              customClass: {
                popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
                confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer',
              },
              buttonsStyling: false
            });
          },
          onError: (error) => {
            Swal.fire({
              title: 'Error',
              text: error?.response?.data?.message || 'No se pudo confirmar la ruta.',
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
      }
    });
  };

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
      return `${day}/${month}/${year}`;
    } catch {
      return fechaStr;
    }
  };

  if (!mostrarVerRutas) return null;

  const routes = rutasResult?.data || [];
  const detailedRoute = detailResult?.data || {};

  // Filter routes based on search term (checks professional name, document or route ID)
  const filteredRoutes = routes.filter(route => {
    const profName = route.personal?.nombre_completo || '';
    const profDoc = route.personal?.numero_documento || '';
    const routeId = route.id_ruta?.toString() || '';
    const date = route.fecha_ruta || '';
    const term = searchTerm.toLowerCase();
    
    return (
      profName.toLowerCase().includes(term) ||
      profDoc.toLowerCase().includes(term) ||
      routeId.includes(term) ||
      date.includes(term)
    );
  });

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
        onClick={() => setActiveMenu(selectedRutaId ? MENU_IDS.DETALLE_RUTA : MENU_IDS.VER_RUTAS)}
        className={`absolute top-52 w-10 h-14 bg-white border border-gray-200 border-l-0 rounded-r-xl shadow-md flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all duration-300 ${
          isMenuOpen ? 'opacity-0 -right-5 pointer-events-none' : 'opacity-100 -right-10'
        }`}
        title="Ver Rutas Creadas"
      >
        <Map size={20} />
      </button>

      {/* Header */}
      <div className={`px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Map size={20} className="text-indigo-600" />
            {isDetailOpen ? `Detalle de Ruta #${selectedRutaId}` : 'Rutas Registradas'}
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
            {isDetailOpen ? 'Paradas y Asignación' : 'Visualización de rutas'}
          </p>
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
            onClick={toggleVerRutasMenu}
            title="Desactivar capa de rutas"
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
          >
            <Power size={18} />
          </button>
        </div>
      </div>

      {/* Main Container: List vs Detail */}
      {!isDetailOpen ? (
        <>
          {/* Search bar inside list view */}
          <div className={`p-5 bg-white border-b border-gray-100 transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
            <div className="relative group">
              <input 
                type="text"
                placeholder="Buscar por profesional, ID o fecha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs font-bold p-3.5 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all text-gray-700 placeholder-gray-400"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                <Search size={18} />
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50/30">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Rutas Creadas {filteredRoutes.length ? `(${filteredRoutes.length})` : ''}
              </span>
              
              {loadingList && (
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[9px] font-black text-indigo-500 uppercase">Cargando</span>
                </div>
              )}
            </div>

            {listError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-xs font-bold border border-red-100">
                Error al consultar listado de rutas
              </div>
            )}

            {!loadingList && !listError && filteredRoutes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center opacity-40">
                <Route size={48} className="text-gray-300 mb-3" />
                <p className="text-[10px] font-bold text-gray-500 px-10 leading-relaxed uppercase tracking-widest">
                  No se encontraron rutas registradas
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {filteredRoutes.map((route) => {
                const isSelected = selectedRutaId === route.id_ruta;
                const totalStops = route.visitas?.length || 0;
                
                return (
                  <div 
                    key={route.id_ruta}
                    onClick={() => setSelectedRutaId(route.id_ruta)}
                    className={`bg-white border p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group active:scale-[0.98] ${
                      isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Route size={20} />
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tight bg-indigo-50/50 px-2 py-0.5 rounded">
                            Ruta #{route.id_ruta}
                          </span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                            route.estado === 'EN_DISENO' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-green-50 text-green-700 border border-green-100'
                          }`}>
                            {route.estado || 'EN_DISENO'}
                          </span>
                        </div>

                        <h4 className="text-[12px] font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase leading-tight truncate">
                          {route.personal?.nombre_completo || 'Sin profesional asignado'}
                        </h4>

                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase mt-2 pt-2 border-t border-gray-50">
                          <Calendar size={10} className="text-gray-400" />
                          <span>{formatFecha(route.fecha_ruta)}</span>
                          <span className="text-gray-300">•</span>
                          <Activity size={10} className="text-gray-400" />
                          <span>{totalStops} {totalStops === 1 ? 'visita' : 'visitas'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Detailed Route View */
        <>
          <div className={`p-4 bg-white border-b border-gray-100 flex items-center gap-3 transition-all duration-300 ${isMapSidebarOpen ? 'pl-10' : ''}`}>
            <button 
              onClick={() => setSelectedRutaId(null)}
              className="p-2 hover:bg-gray-150 rounded-xl text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-[11px] font-black uppercase border border-gray-250 cursor-pointer bg-white"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
            <div className="h-4 w-px bg-gray-200"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Información de Asignación
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50/30">
            {loadingDetail ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargando detalles...</p>
              </div>
            ) : detailError ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-xs font-bold border border-red-100">
                Error al consultar detalle de la ruta.
              </div>
            ) : (
              <div className="space-y-5">
                {/* Professional Assignment Card */}
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <span className="block text-[8px] font-black text-gray-400 uppercase tracking-wider">Profesional Asignado</span>
                      <h4 className="text-[13px] font-black text-gray-900 uppercase">
                        {detailedRoute.personal?.nombre_completo || 'No asignado'}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 font-sans">
                    <div className="p-2 bg-gray-50 rounded-xl text-center">
                      <span className="block text-[8px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Identificación</span>
                      <span className="text-[10px] font-bold text-gray-700">
                        {detailedRoute.personal?.numero_documento || 'N/A'}
                      </span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xl text-center">
                      <span className="block text-[8px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Fecha Ejecución</span>
                      <span className="text-[10px] font-bold text-gray-700">
                        {formatFecha(detailedRoute.fecha_ruta)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                    {detailedRoute.estado === 'EN_DISENO' && (
                      <button 
                        onClick={() => handleAsignar(detailedRoute.id_ruta)}
                        disabled={asignarRutaMutation.isPending}
                        className="w-full flex items-center justify-center gap-1.5 p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition-colors font-black uppercase text-[9px]"
                      >
                        <CheckSquare size={14} />
                        Confirmar Diseño
                      </button>
                    )}
                    {detailedRoute.estado !== 'FINALIZADA' && (
                      <button 
                        onClick={() => handleEliminar(detailedRoute.id_ruta)}
                        disabled={eliminarRutaMutation.isPending}
                        className={`${detailedRoute.estado !== 'EN_DISENO' ? 'col-span-2' : ''} w-full flex items-center justify-center gap-1.5 p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors font-black uppercase text-[9px]`}
                      >
                        <Trash2 size={14} />
                        Eliminar Ruta
                      </button>
                    )}
                  </div>
                </div>

                {/* Paradas Title */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Secuencia de Visitas ({detailedRoute.visitas?.length || 0})
                  </span>
                </div>

                {detailedRoute.visitas?.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                      No hay visitas asignadas a esta ruta
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detailedRoute.visitas?.map((visita, index) => {
                      const paciente = visita.paciente || {};
                      const lat = paciente.latitud;
                      const lng = paciente.longitud;
                      const hasCoords = lat && lng;

                      return (
                        <div 
                          key={visita.id_visita}
                          className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-3"
                        >
                          {/* Order counter */}
                          <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm">
                            {visita.orden_visita || (index + 1)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-black text-gray-900 uppercase leading-[1.3] truncate mb-1">
                              {paciente.nombre_completo || 'Paciente Desconocido'}
                            </h4>

                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase mt-1.5">
                              <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                              <span className="truncate">{paciente.direccion || 'Sin dirección registrada'}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                              <ClipboardList size={10} className="text-gray-400 flex-shrink-0" />
                              <span>Identificación: {paciente.identificacion || 'N/A'}</span>
                            </div>

                            {hasCoords ? (
                              <button
                                onClick={() => seleccionarPaciente(paciente.id_paciente, paciente)}
                                className="mt-2.5 flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase hover:underline border-none bg-transparent p-0 cursor-pointer"
                              >
                                <MapPin size={8} /> Centrar en el mapa
                              </button>
                            ) : (
                              <span className="mt-2.5 block text-[8px] font-black text-orange-400 uppercase">
                                • Sin coordenadas de geolocalización
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
