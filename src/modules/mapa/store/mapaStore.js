import { create } from 'zustand';

/**
 * Constantes de IDs de Menú para consistencia de la UI
 */
export const MENU_IDS = {
  PACIENTES: 'PACIENTES',
  PROFESIONALES: 'PROFESIONALES',
  COMUNAS: 'COMUNAS',
  PACIENTES_COMUNA: 'PACIENTES_COMUNA',
  DETALLE_PACIENTE: 'DETALLE_PACIENTE',
  OPTIMIZADOR_GLOBAL: 'OPTIMIZADOR_GLOBAL',
  OPTIMIZADOR: 'OPTIMIZADOR',
  CREAR_RUTAS: 'CREAR_RUTAS'
};

// --- Estados Iniciales para Reset ---
const INITIAL_PACIENTES_FILTERS = {
  page: 1,
  per_page: 50,
  search: '',
  id_zona: '',
  id_comuna: '',
  id_aseguradora: '',
  estado: 'ACTIVO',
};

const INITIAL_PROFESIONALES_FILTERS = {
  page: 1,
  per_page: 200,
  id_profesional: '',
  fecha_inicio: new Date().toISOString().split('T')[0],
  fecha_fin: new Date().toISOString().split('T')[0],
};

const INITIAL_GLOBALES_FILTERS = {
  bloques: []
};

const INITIAL_OPTIMIZADOR_FILTERS = {
  mes: new Date().getMonth() + 1,
  anio: new Date().getFullYear(),
  tipo_filtro: 'pacientes',
  bloques: [],
  ver_agendados: false,
  id_servicio: ''
};

const INITIAL_CREAR_RUTAS_FILTERS = {
  mes: new Date().getMonth() + 1,
  anio: new Date().getFullYear(),
  id_servicio: '',
  id_personal: ''
};

/**
 * Estado de limpieza total (Capa base para toggles exclusivos)
 */
const CLEAR_STATE = {
  mostrarPacientes: false,
  mostrarProfesionales: false,
  mostrarRutasGlobales: false,
  mostrarOptimizador: false,
  mostrarCrearRutas: false,
  activeMenuId: null,
  // Reset Filtros
  pacientesFilters: INITIAL_PACIENTES_FILTERS,
  profesionalesFilters: INITIAL_PROFESIONALES_FILTERS,
  rutasGlobalesFilters: INITIAL_GLOBALES_FILTERS,
  optimizadorFilters: INITIAL_OPTIMIZADOR_FILTERS,
  crearRutasFilters: INITIAL_CREAR_RUTAS_FILTERS,
  // Reset Selecciones
  selectedPacienteId: null,
  selectedComunas: [],
  filtroComunaId: '',
  selectedVisitasIds: [],
  // Reset Optimización Local
  isComparingLocalRoute: false,
  localOptimizedRoute: [],
  distanciaOriginal: 0,
  distanciaOptimizada: 0,
  // Reset Herramientas
  isRulerActive: false,
  rulerPoints: []
};

export const useMapaStore = create((set, get) => ({
  // --- Estado de la Barra Lateral Principal ---
  isMapSidebarOpen: false,
  toggleMapSidebar: () => set((state) => ({ isMapSidebarOpen: !state.isMapSidebarOpen })),
  
  // --- Patrón de Menú Activo ---
  activeMenuId: null, 
  setActiveMenu: (menuId) => set({ activeMenuId: menuId }),
  closeAllMenus: () => set({ activeMenuId: null }),

  // --- Capas con Toggles Exclusivos y Limpieza Atómica ---
  mostrarPacientes: false,
  toggleMostrarPacientes: () => set((state) => {
    const isCurrentlyActive = state.mostrarPacientes;
    if (isCurrentlyActive) return { ...state, ...CLEAR_STATE };
    
    return { 
      ...state,
      ...CLEAR_STATE,
      mostrarPacientes: true,
      activeMenuId: state.tipoVistaPacientes === 'GENERAL' ? MENU_IDS.PACIENTES : MENU_IDS.PACIENTES_COMUNA
    };
  }),

  mostrarProfesionales: false,
  toggleMostrarProfesionales: () => set((state) => {
    const isCurrentlyActive = state.mostrarProfesionales;
    if (isCurrentlyActive) return { ...state, ...CLEAR_STATE };
    
    return { 
      ...state,
      ...CLEAR_STATE,
      mostrarProfesionales: true,
      activeMenuId: MENU_IDS.PROFESIONALES
    };
  }),

  mostrarRutasGlobales: false,
  toggleRutasGlobalesMenu: () => set((state) => {
    const isCurrentlyActive = state.mostrarRutasGlobales;
    if (isCurrentlyActive) return { ...state, ...CLEAR_STATE };
    
    return {
      ...state,
      ...CLEAR_STATE,
      mostrarRutasGlobales: true,
      activeMenuId: MENU_IDS.OPTIMIZADOR_GLOBAL
    };
  }),

  mostrarOptimizador: false,
  toggleOptimizadorMenu: () => set((state) => {
    const isCurrentlyActive = state.mostrarOptimizador;
    if (isCurrentlyActive) return { ...state, ...CLEAR_STATE };
    
    return {
      ...state,
      ...CLEAR_STATE,
      mostrarOptimizador: true,
      activeMenuId: MENU_IDS.OPTIMIZADOR
    };
  }),

  toggleComunasMenu: () => set((state) => {
    const isCurrentlyActive = state.activeMenuId === MENU_IDS.COMUNAS;
    if (isCurrentlyActive) return { ...state, ...CLEAR_STATE };
    
    return { 
      ...state,
      ...CLEAR_STATE,
      activeMenuId: MENU_IDS.COMUNAS,
      selectedComunas: [] 
    };
  }),

  // --- Lógica de Pacientes ---
  pacientesFilters: INITIAL_PACIENTES_FILTERS,
  setPacientesFilters: (newFilters) => 
    set((state) => ({
      pacientesFilters: { ...state.pacientesFilters, ...newFilters, page: 1 }
    })),
  setPacientesPage: (page) => 
    set((state) => ({
      pacientesFilters: { ...state.pacientesFilters, page }
    })),

  tipoVistaPacientes: 'GENERAL', 
  filtroComunaId: '', 
  setTipoVistaPacientes: (tipo) => set((state) => ({ 
    tipoVistaPacientes: tipo,
    ...(state.mostrarPacientes ? {
       activeMenuId: tipo === 'GENERAL' ? MENU_IDS.PACIENTES : MENU_IDS.PACIENTES_COMUNA
    } : {})
  })),
  setFiltroComunaId: (id) => set({ filtroComunaId: id }),

  // --- Lógica de Rutas Globales ---
  rutasGlobalesFilters: INITIAL_GLOBALES_FILTERS,
  setRutasGlobalesFilters: (filters) => set((state) => ({
    rutasGlobalesFilters: { ...state.rutasGlobalesFilters, ...filters }
  })),
  toggleBloqueFilter: (bloqueId) => set((state) => {
    const { bloques } = state.rutasGlobalesFilters;
    const newBloques = bloques.includes(bloqueId)
      ? bloques.filter(id => id !== bloqueId)
      : [...bloques, bloqueId];
    
    return {
      rutasGlobalesFilters: { ...state.rutasGlobalesFilters, bloques: newBloques }
    };
  }),
  clearBloqueFilters: () => set((state) => ({
    rutasGlobalesFilters: { ...state.rutasGlobalesFilters, bloques: [] }
  })),

  // --- Lógica de Optimizador Proyectado ---
  optimizadorFilters: INITIAL_OPTIMIZADOR_FILTERS,
  setOptimizadorFilters: (filters) => set((state) => ({
    optimizadorFilters: { ...state.optimizadorFilters, ...filters }
  })),
  toggleBloqueOptimizador: (bloqueId) => set((state) => {
    const { bloques } = state.optimizadorFilters;
    const newBloques = bloques.includes(bloqueId)
      ? bloques.filter(id => id !== bloqueId)
      : [...bloques, bloqueId];
    
    return {
      optimizadorFilters: { ...state.optimizadorFilters, bloques: newBloques }
    };
  }),

  // --- Lógica de Crear Rutas ---
  mostrarCrearRutas: false,
  toggleCrearRutasMenu: () => set((state) => {
    const isCurrentlyActive = state.mostrarCrearRutas;
    if (isCurrentlyActive) return { ...state, ...CLEAR_STATE };
    
    return {
      ...state,
      ...CLEAR_STATE,
      mostrarCrearRutas: true,
      activeMenuId: MENU_IDS.CREAR_RUTAS
    };
  }),
  crearRutasFilters: INITIAL_CREAR_RUTAS_FILTERS,
  setCrearRutasFilters: (filters) => set((state) => ({
    crearRutasFilters: { ...state.crearRutasFilters, ...filters }
  })),
  selectedVisitasIds: [],
  toggleSelectedVisita: (id) => set((state) => {
    const isSelected = state.selectedVisitasIds.includes(id);
    const newSelected = isSelected
      ? state.selectedVisitasIds.filter(vId => vId !== id)
      : [...state.selectedVisitasIds, id];
    return { selectedVisitasIds: newSelected };
  }),
  clearSelectedVisitas: () => set({ selectedVisitasIds: [] }),
  setSelectedVisitas: (ids) => set({ selectedVisitasIds: ids }),

  // --- Lógica de Profesionales ---
  profesionalesFilters: INITIAL_PROFESIONALES_FILTERS,
  setProfesionalesFilters: (newFilters) => 
    set((state) => ({
      profesionalesFilters: { ...state.profesionalesFilters, ...newFilters, page: 1 }
    })),
    
  // --- Detalle del Paciente ---
  selectedPacienteId: null,
  selectedPacienteInfo: null,
  seleccionarPaciente: (id, info = null) => set({ 
    selectedPacienteId: id, 
    selectedPacienteInfo: info,
    activeMenuId: id ? MENU_IDS.DETALLE_PACIENTE : null 
  }),
  cerrarDetalle: () => set((state) => ({ 
    selectedPacienteId: null, 
    selectedPacienteInfo: null,
    activeMenuId: state.mostrarPacientes 
      ? (state.tipoVistaPacientes === 'GENERAL' ? MENU_IDS.PACIENTES : MENU_IDS.PACIENTES_COMUNA) 
      : (state.activeMenuId === MENU_IDS.DETALLE_PACIENTE ? null : state.activeMenuId)
  })),

  // --- Comunas ---
  selectedComunas: [], 
  toggleComunaSelection: (comunaId) => set((state) => ({
    selectedComunas: state.selectedComunas.includes(comunaId)
      ? state.selectedComunas.filter(id => id !== comunaId)
      : [...state.selectedComunas, comunaId]
  })),
  setComunasSelected: (comunasIds) => set({ selectedComunas: comunasIds }),

  // --- Optimización Local ---
  isComparingLocalRoute: false,
  localOptimizedRoute: [],
  distanciaOriginal: 0,
  distanciaOptimizada: 0,
  setLocalOptimization: (data) => set({ isComparingLocalRoute: true, localOptimizedRoute: data.optimized, distanciaOriginal: data.distanciaOriginal, distanciaOptimizada: data.distanciaOptimizada }),
  clearLocalOptimization: () => set({ isComparingLocalRoute: false, localOptimizedRoute: [], distanciaOriginal: 0, distanciaOptimizada: 0 }),

  // --- Herramienta de Regla ---
  isRulerActive: false,
  rulerPoints: [], 
  setRulerActive: (val) => set({ isRulerActive: val, rulerPoints: [] }),
  toggleRuler: () => set((state) => ({ isRulerActive: !state.isRulerActive, rulerPoints: [] })),
  addRulerPoint: (latlng) => set((state) => ({ rulerPoints: state.rulerPoints.length >= 2 ? [latlng] : [...state.rulerPoints, latlng] })),
  clearRuler: () => set({ rulerPoints: [] }),

}));
