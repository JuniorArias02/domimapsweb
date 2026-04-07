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

  profesionalesFilters: {
    page: 1,
    per_page: 50,
    id_profesional: '', // para filtrar por profesional
    fecha_inicio: '', // fecha atencion A
    fecha_fin: '',    // fecha atencion B
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

  // Espacio para futuras funcionalidades
}));
