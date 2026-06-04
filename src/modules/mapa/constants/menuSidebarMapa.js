import { Users, BriefcaseMedical, Globe, Zap, Route, Map } from 'lucide-react';

export const itemsMenuSidebar = [
  {
    id: 'pacientes',
    etiqueta: 'Pacientes',
    descripcion: 'Ver red de domicilios',
    icono: Users,
    colorKey: 'blue',
    storeKeyActivo: 'mostrarPacientes',
    storeKeyToggle: 'toggleMostrarPacientes'
  },
  {
    id: 'profesionales',
    etiqueta: 'Profesionales',
    descripcion: 'Ver equipo médico',
    icono: BriefcaseMedical,
    colorKey: 'emerald',
    storeKeyActivo: 'mostrarProfesionales',
    storeKeyToggle: 'toggleMostrarProfesionales'
  },
  // {
  //   id: 'rutasGlobales',
  //   etiqueta: 'Ruta Paciente',
  //   descripcion: 'Optimización Global',
  //   icono: Globe,
  //   colorKey: 'blue600',
  //   storeKeyActivo: 'mostrarRutasGlobales',
  //   storeKeyToggle: 'toggleRutasGlobalesMenu'
  // },
  {
    id: 'optimizador',
    etiqueta: 'Optimizador',
    descripcion: 'Frecuencia y Cercanía',
    icono: Zap,
    colorKey: 'amber',
    storeKeyActivo: 'mostrarOptimizador',
    storeKeyToggle: 'toggleOptimizadorMenu'
  },
  {
    id: 'crearRutas',
    etiqueta: 'Crear Rutas',
    descripcion: 'Visitas Programadas',
    icono: Route,
    colorKey: 'indigo',
    storeKeyActivo: 'mostrarCrearRutas',
    storeKeyToggle: 'toggleCrearRutasMenu'
  },
  {
    id: 'verRutas',
    etiqueta: 'Ver Rutas',
    descripcion: 'Listar rutas creadas',
    icono: Map,
    colorKey: 'indigo',
    storeKeyActivo: 'mostrarVerRutas',
    storeKeyToggle: 'toggleVerRutasMenu'
  }
];

export const COLOR_CONFIGS = {
  blue: {
    activeBg: 'bg-blue-50/50 border-blue-100 shadow-sm shadow-blue-500/5',
    activeIcon: 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30',
    activeText: 'text-[#2563EB]',
    activeSwitch: 'bg-[#2563EB]'
  },
  emerald: {
    activeBg: 'bg-emerald-50/50 border-emerald-100 shadow-sm shadow-emerald-500/5',
    activeIcon: 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/30',
    activeText: 'text-[#10B981]',
    activeSwitch: 'bg-[#10B981]'
  },
  blue600: {
    activeBg: 'bg-blue-50/50 border-blue-100 shadow-sm shadow-blue-500/5',
    activeIcon: 'bg-blue-600 text-white shadow-lg shadow-blue-500/30',
    activeText: 'text-blue-600',
    activeSwitch: 'bg-blue-600'
  },
  amber: {
    activeBg: 'bg-amber-50/50 border-amber-100 shadow-sm shadow-amber-500/5',
    activeIcon: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    activeText: 'text-amber-600',
    activeSwitch: 'bg-amber-500'
  },
  indigo: {
    activeBg: 'bg-indigo-50/50 border-indigo-100 shadow-sm shadow-indigo-500/5',
    activeIcon: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30',
    activeText: 'text-indigo-600',
    activeSwitch: 'bg-indigo-600'
  }
};
