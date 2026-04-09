import { create } from 'zustand';

export const useMapaStore = create((set) => ({
  isMapSidebarOpen: false,
  toggleMapSidebar: () => set((state) => ({ isMapSidebarOpen: !state.isMapSidebarOpen })),
  
  mostrarPacientes: false,
  toggleMostrarPacientes: () => set((state) => ({ 
    mostrarPacientes: !state.mostrarPacientes,
    isPacientesMenuOpen: !state.mostrarPacientes,
    // Turns off profesionales if turning on pacientes
    ...( !state.mostrarPacientes ? { mostrarProfesionales: false, isProfesionalesMenuOpen: false } : {} )
  })),

  isPacientesMenuOpen: false,
  togglePacientesMenu: () => set((state) => ({ isPacientesMenuOpen: !state.isPacientesMenuOpen })),
  setPacientesMenuOpen: (isOpen) => set({ isPacientesMenuOpen: isOpen }),
  
  // Profesionales Layer
  mostrarProfesionales: false,
  toggleMostrarProfesionales: () => set((state) => ({
    mostrarProfesionales: !state.mostrarProfesionales,
    isProfesionalesMenuOpen: !state.mostrarProfesionales,
    // Turns off pacientes if turning on profesionales
    ...( !state.mostrarProfesionales ? { mostrarPacientes: false, isPacientesMenuOpen: false } : {} )
  })),

  isProfesionalesMenuOpen: false,
  toggleProfesionalesMenu: () => set((state) => ({ isProfesionalesMenuOpen: !state.isProfesionalesMenuOpen })),
  setProfesionalesMenuOpen: (isOpen) => set({ isProfesionalesMenuOpen: isOpen }),
  
  pacientesFilters: {
    page: 1,
    per_page: 50,
    search: '', // extra for name search if needed
    id_zona: '',
    id_comuna: '',
    id_aseguradora: '',
    estado: 'ACTIVO',
  },
  
  setPacientesFilters: (newFilters) => 
    set((state) => ({
      pacientesFilters: { ...state.pacientesFilters, ...newFilters, page: 1 } // Reset to page 1 on filter change
    })),
    
  setPacientesPage: (page) => 
    set((state) => ({
      pacientesFilters: { ...state.pacientesFilters, page }
    })),

  // --- Nueva Opción: Pacientes por Comuna (Opción 2) ---
  tipoVistaPacientes: 'GENERAL', // 'GENERAL' o 'POR_COMUNA'
  filtroComunaId: '', 
  
  setTipoVistaPacientes: (tipo) => set({ tipoVistaPacientes: tipo }),
  setFiltroComunaId: (id) => set({ filtroComunaId: id }),

  profesionalesFilters: {
    page: 1,
    per_page: 200,
    id_profesional: '', // para filtrar por profesional
    fecha_inicio: new Date().toISOString().split('T')[0], // fecha atencion A (Hoy)
    fecha_fin: new Date().toISOString().split('T')[0],    // fecha atencion B (Hoy)
  },

  setProfesionalesFilters: (newFilters) => 
    set((state) => ({
      profesionalesFilters: { ...state.profesionalesFilters, ...newFilters, page: 1 }
    })),

  setProfesionalesPage: (page) => 
    set((state) => ({
      profesionalesFilters: { ...state.profesionalesFilters, page }
    })),
    
  // Detalle de Paciente Seleccionado
  selectedPacienteId: null,
  isDetalleSidebarOpen: false,
  seleccionarPaciente: (id) => set({ 
    selectedPacienteId: id, 
    isDetalleSidebarOpen: !!id 
  }),
  setDetalleSidebarOpen: (isOpen) => set({ isDetalleSidebarOpen: isOpen }),
  cerrarDetalle: () => set({ selectedPacienteId: null, isDetalleSidebarOpen: false }),

  // --- Capa de Comunas ---
  isComunasMenuOpen: false,
  selectedComunas: [], // IDs de las comunas seleccionadas ['comuna1', 'comuna2', ...]
  
  toggleComunasMenu: () => set((state) => ({ 
    isComunasMenuOpen: !state.isComunasMenuOpen,
    // Close others to keep UI clean
    ...( !state.isComunasMenuOpen ? { isPacientesMenuOpen: false, isProfesionalesMenuOpen: false } : {} )
  })),
  
  toggleComunaSelection: (comunaId) => set((state) => ({
    selectedComunas: state.selectedComunas.includes(comunaId)
      ? state.selectedComunas.filter(id => id !== comunaId)
      : [...state.selectedComunas, comunaId]
  })),

  setComunasSelected: (comunasIds) => set({ selectedComunas: comunasIds }),

  // Espacio para futuras funcionalidades
}));
