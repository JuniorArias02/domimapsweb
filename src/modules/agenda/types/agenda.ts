/**
 * Capa de Dominio (Domain)
 * Representa la entidad Agenda tal como viene del backend.
 */

export interface Agenda {
  id_orden: number;
  id_paciente: number;
  id_especialidad: number;
  id_personal_ordena: number | null;
  fecha_orden: string;
  numero_sesiones: number;
  frecuencia_dias: number;
  numero_mipres: string | null;
  observacion: string | null;
  estado: 'VIGENTE' | 'FINALIZADA' | 'CANCELADA' | string;
  created_at: string;
  updated_at: string;
  nombre_paciente: string;
  identificacion_paciente: string;
  nombre_especialidad: string;
}

export interface AgendaMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface AgendaResponse {
  success: boolean;
  data: Agenda[];
  meta: AgendaMeta;
}

export interface AgendaFilters {
  page: number;
  per_page: number;
  buscar: string;
  estado: string;
}
