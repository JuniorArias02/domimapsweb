import { Users, Calendar, FileText, Activity } from 'lucide-react';

// Hook de lógica del panel de control
export function useDashboard() {
  const estadisticas = [
    { nombre: 'Pacientes Activos', valor: '128', icono: Users, colorIcono: 'text-blue-600', fondoIcono: 'bg-blue-100' },
    { nombre: 'Citas Hoy', valor: '12', icono: Calendar, colorIcono: 'text-green-600', fondoIcono: 'bg-green-100' },
    { nombre: 'Historias Pendientes', valor: '8', icono: FileText, colorIcono: 'text-purple-600', fondoIcono: 'bg-purple-100' },
    { nombre: 'Alertas Médicas', valor: '2', icono: Activity, colorIcono: 'text-red-600', fondoIcono: 'bg-red-100' },
  ];

  const proximasVisitas = [
    { nombre: 'Juan Pérez', servicio: 'Auditoría', hora: '14:00', estado: 'Confirmado', colorEstado: 'text-green-600 bg-green-50' },
    { nombre: 'Maria García', servicio: 'Curación', hora: '15:30', estado: 'En camino', colorEstado: 'text-blue-600 bg-blue-50' },
    { nombre: 'Andrés Lopez', servicio: 'Inyectología', hora: '16:45', estado: 'Pendiente', colorEstado: 'text-gray-600 bg-gray-50' },
  ];

  const actividadReciente = [
    { etiqueta: 'Nuevo paciente registrado', tiempo: 'Hace 10 min', icono: Users, color: 'bg-blue-50 text-blue-600' },
    { etiqueta: 'Visita completada ID-294', tiempo: 'Hace 1 hora', icono: Calendar, color: 'bg-green-50 text-green-600' },
    { etiqueta: 'Historia clínica actualizada', tiempo: 'Hace 2 horas', icono: FileText, color: 'bg-purple-50 text-purple-600' },
  ];

  return { estadisticas, proximasVisitas, actividadReciente };
}
