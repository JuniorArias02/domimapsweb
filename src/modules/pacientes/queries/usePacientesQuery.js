import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  obtenerPacientes,
  obtenerPacientePorId,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from '../services/pacientesService';
import { obtenerAseguradoras } from '../services/aseguradorasService';
import { obtenerBarrios } from '../services/barriosService';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const QUERY_KEYS_PACIENTES = {
  all: ['pacientes'],
  todos: (params) => ['pacientes', 'list', params],
  detalle: (id) => ['pacientes', 'detail', id],
  aseguradoras: ['aseguradoras'],
  barrios: ['barrios'],
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Lista aseguradoras para selects.
 */
export const useAseguradorasQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS_PACIENTES.aseguradoras,
    queryFn: obtenerAseguradoras,
    staleTime: 1000 * 60 * 30, // 30 minutos (cambian poco)
  });
};

/**
 * Lista barrios para selects.
 */
export const useBarriosQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS_PACIENTES.barrios,
    queryFn: obtenerBarrios,
    staleTime: 1000 * 60 * 60, // 1 hora (no cambian casi nunca)
  });
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Lista todos los pacientes.
 * @param {Object} params - Objeto de parámetros (pagina, por_pagina, nombre, identificacion, etc)
 * @param {Object} options - Opciones adicionales de react-query (ej. enabled)
 */
export const usePacientesQuery = (params = { pagina: 1 }, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS_PACIENTES.todos(params),
    queryFn: () => obtenerPacientes(params),
    keepPreviousData: true, // Mantiene los datos anteriores mientras carga la nueva página
    ...options
  });
};

/**
 * Obtiene el detalle de un paciente por ID.
 * @param {number|string} id
 */
export const usePacienteDetalleQuery = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS_PACIENTES.detalle(id),
    queryFn: () => obtenerPacientePorId(id),
    enabled: !!id,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Mutación para crear un nuevo paciente.
 */
export const useCrearPacienteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearPaciente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_PACIENTES.all });
    },
  });
};

/**
 * Mutación para actualizar un paciente existente.
 */
export const useActualizarPacienteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }) => actualizarPaciente(id, datos),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_PACIENTES.all });
    },
  });
};

/**
 * Mutación para eliminar un paciente.
 */
export const useEliminarPacienteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarPaciente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_PACIENTES.all });
    },
  });
};

