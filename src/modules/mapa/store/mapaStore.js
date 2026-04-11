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
  OPTIMIZADOR_GLOBAL: 'OPTIMIZADOR_GLOBAL'
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
  mes: new Date().getMonth() + 1,
  anio: new Date().getFullYear(),
  bloque: 'TODOS'
};

export const useMapaStore = create((set) => ({
  // --- Estado de la Barra Lateral Principal (Extremo izquierdo) ---
  isMapSidebarOpen: false,
  toggleMapSidebar: () => set((state) => ({ isMapSidebarOpen: !state.isMapSidebarOpen })),
  
  // --- Patrón de Menú Activo (Visibilidad exclusiva) ---
  activeMenuId: null, 
  setActiveMenu: (menuId) => set((state) => ({ 
    activeMenuId: state.activeMenuId === menuId ? null : menuId 
  })),
  closeAllMenus: () => set({ activeMenuId: null }),

  // --- Visibilidad de las Capas del Mapa ---
  mostrarPacientes: false,
  setMostrarPacientes: (val) => set({ mostrarPacientes: val }),
  toggleMostrarPacientes: () => set((state) => {
    const newVal = !state.mostrarPacientes;
    let targetMenu = null;
    if (newVal) {
      targetMenu = state.tipoVistaPacientes === 'GENERAL' ? MENU_IDS.PACIENTES : MENU_IDS.PACIENTES_COMUNA;
    }
    
    return { 
      mostrarPacientes: newVal,
      activeMenuId: newVal ? targetMenu : (state.activeMenuId === MENU_IDS.PACIENTES || state.activeMenuId === MENU_IDS.PACIENTES_COMUNA ? null : state.activeMenuId),
      // LIMPIEZA AL APAGAR
      ...(!newVal ? {
        pacientesFilters: INITIAL_PACIENTES_FILTERS,
        selectedPacienteId: null,
        selectedComunas: [], // Limpiar polígono si estaba por filtro
        filtroComunaId: ''
      } : {
        mostrarProfesionales: false // Desactivar profesionales si activamos pacientes
      })
    };
  }),

  mostrarProfesionales: false,
  setMostrarProfesionales: (val) => set({ mostrarProfesionales: val }),
  toggleMostrarProfesionales: () => set((state) => {
    const newVal = !state.mostrarProfesionales;
    return { 
      mostrarProfesionales: newVal,
      activeMenuId: newVal ? MENU_IDS.PROFESIONALES : (state.activeMenuId === MENU_IDS.PROFESIONALES ? null : state.activeMenuId),
      // LIMPIEZA AL APAGAR
      ...(!newVal ? {
        profesionalesFilters: INITIAL_PROFESIONALES_FILTERS,
        isComparingLocalRoute: false,
        localOptimizedRoute: [],
        distanciaOriginal: 0,
        distanciaOptimizada: 0
      } : {
        mostrarPacientes: false // Desactivar pacientes si activamos profesionales
      })
    };
  }),

  mostrarRutasGlobales: false,
  setMostrarRutasGlobales: (val) => set({ mostrarRutasGlobales: val }),
  toggleRutasGlobalesMenu: () => set((state) => {
    const isOpening = state.activeMenuId !== MENU_IDS.OPTIMIZADOR_GLOBAL;
    return {
      activeMenuId: isOpening ? MENU_IDS.OPTIMIZADOR_GLOBAL : null,
      mostrarRutasGlobales: isOpening, // Sincronizamos visibilidad con el menú
      ...(!isOpening ? { rutasGlobalesFilters: INITIAL_GLOBALES_FILTERS } : {})
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

  // --- Lógica de Profesionales ---
  profesionalesFilters: INITIAL_PROFESIONALES_FILTERS,
  setProfesionalesFilters: (newFilters) => 
    set((state) => ({
      profesionalesFilters: { ...state.profesionalesFilters, ...newFilters, page: 1 }
    })),
  setProfesionalesPage: (page) => 
    set((state) => ({
      profesionalesFilters: { ...state.profesionalesFilters, page }
    })),
    
  // --- Detalle del Paciente ---
  selectedPacienteId: null,
  seleccionarPaciente: (id) => set({ 
    selectedPacienteId: id, 
    activeMenuId: id ? MENU_IDS.DETALLE_PACIENTE : null 
  }),
  cerrarDetalle: () => set((state) => ({ 
    selectedPacienteId: null, 
    activeMenuId: state.activeMenuId === MENU_IDS.DETALLE_PACIENTE ? null : state.activeMenuId
  })),

  // --- Comunas ---
  selectedComunas: [], 
  toggleComunasMenu: () => set((state) => {
    const isClosing = state.activeMenuId === MENU_IDS.COMUNAS;
    return { 
      activeMenuId: isClosing ? null : MENU_IDS.COMUNAS,
      // Al apagar el menú de comunas desde el sidebar, limpiamos la selección visual
      ...(isClosing ? { selectedComunas: [] } : {})
    };
  }),
  toggleComunaSelection: (comunaId) => set((state) => ({
    selectedComunas: state.selectedComunas.includes(comunaId)
      ? state.selectedComunas.filter(id => id !== comunaId)
      : [...state.selectedComunas, comunaId]
  })),
  setComunasSelected: (comunasIds) => set({ selectedComunas: comunasIds }),

  // --- Optimización Local (Comparativa) ---
  isComparingLocalRoute: false,
  localOptimizedRoute: [],
  distanciaOriginal: 0,
  distanciaOptimizada: 0,
  
  setLocalOptimization: (data) => set({
    isComparingLocalRoute: true,
    localOptimizedRoute: data.optimized,
    distanciaOriginal: data.distanciaOriginal,
    distanciaOptimizada: data.distanciaOptimizada
  }),
  
  clearLocalOptimization: () => set({
    isComparingLocalRoute: false,
    localOptimizedRoute: [],
    distanciaOriginal: 0,
    distanciaOptimizada: 0
  }),

  // --- Herramienta de Regla Virtual ---
  isRulerActive: false,
  rulerPoints: [], // Máximo 2 puntos
  setRulerActive: (val) => set({ isRulerActive: val, rulerPoints: [] }),
  toggleRuler: () => set((state) => ({ isRulerActive: !state.isRulerActive, rulerPoints: [] })),
  addRulerPoint: (latlng) => set((state) => {
    const newPoints = state.rulerPoints.length >= 2 ? [latlng] : [...state.rulerPoints, latlng];
    return { rulerPoints: newPoints };
  }),
  clearRuler: () => set({ rulerPoints: [] }),

}));
