/**
 * Capa de Dominio (Domain)
 * Estructura estricta para el payload de creación de Agenda.
 */
export interface AgendaPayload {
  id_paciente: number;
  id_especialidad: number;
  numero_sesiones: number;
  frecuencia_dias: number;
  fecha_inicio: string; // Formato esperado: yyyy-mm-dd
  id_personal?: number | null;
}
