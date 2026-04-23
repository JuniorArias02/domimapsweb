import { Users, Calendar, FileText, Activity } from 'lucide-react';

/**
 * Configuración estática para las tarjetas de estadísticas del Dashboard.
 * Define el layout, iconos y colores para mantener el componente limpio.
 */
export const DASHBOARD_STATS_CONFIG = [
  {
    id: 'pacientes_activos',
    nombre: 'Pacientes Activos',
    icono: Users,
    colorIcono: 'text-blue-600',
    fondoIcono: 'bg-blue-50'
  },
  {
    id: 'visitas_hoy',
    nombre: 'Visitas Hoy',
    icono: Calendar,
    colorIcono: 'text-emerald-600',
    fondoIcono: 'bg-emerald-50'
  },
  {
    id: 'ordenes_vigentes',
    nombre: 'Órdenes Vigentes',
    icono: FileText,
    colorIcono: 'text-purple-600',
    fondoIcono: 'bg-purple-50'
  },
  {
    id: 'tutelas_activas',
    nombre: 'Tutelas Activas',
    icono: Activity,
    colorIcono: 'text-red-600',
    fondoIcono: 'bg-red-50'
  },
];
