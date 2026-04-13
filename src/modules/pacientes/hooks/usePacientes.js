import { useState, useCallback, useMemo } from 'react';
import { usePacientesQuery } from '../queries/usePacientesQuery';

/**
 * Hook de lógica de UI para la página de pacientes.
 * Gestiona búsqueda, filtrado, modal y selección con el backend.
 */

export function usePacientes() {
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  
  // Construimos los parámetros para el endpoint basado en el estado
  const queryParams = useMemo(() => {
    const params = {
      pagina,
      por_pagina: 15,
    };

    if (busqueda.trim()) {
      const termino = busqueda.trim();
      // Si el término es numérico, asumimos que es una cédula / identificación
      const esNumero = /^[0-9]+$/.test(termino);
      if (esNumero) {
        params.identificacion = termino;
      } else {
        params.nombre = termino;
      }
    }
    return params;
  }, [pagina, busqueda]);

  const { data: respuesta, isLoading, isError, error, isFetching } = usePacientesQuery(queryParams);
  
  // Extraemos el array de pacientes de la propiedad .data
  const pacientesFiltrados = respuesta?.data || [];
  const meta = respuesta?.meta || null;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const manejarCambioPagina = (nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const manejarCambioBusqueda = (valor) => {
    setBusqueda(valor);
    setPagina(1); // Reiniciar a página 1 cuando buscamos
  };

  const abrirModalCrear = useCallback(() => {
    setPacienteSeleccionado(null);
    setModalAbierto(true);
  }, []);

  const abrirModalEditar = useCallback((paciente) => {
    setPacienteSeleccionado(paciente);
    setModalAbierto(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setPacienteSeleccionado(null);
  }, []);

  return {
    pacientes: pacientesFiltrados,
    pacientesFiltrados, // Retornamos esto porque PacientesPage.jsx lo usa
    isLoading,
    isError,
    isFetching,
    error,
    busqueda,
    meta,
    pagina,
    setBusqueda: manejarCambioBusqueda,
    manejarCambioPagina,
    modalAbierto,
    pacienteSeleccionado,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
  };
}
