import { useState, useCallback } from 'react';
import { usePacientesQuery } from '../queries/usePacientesQuery';

/**
 * Hook de lógica de UI para la página de pacientes.
 * Gestiona búsqueda, filtrado, modal y selección.
 */

export function usePacientes() {
  const [pagina, setPagina] = useState(1);
  const { data: respuesta, isLoading, isError, error, isFetching } = usePacientesQuery(pagina);
  console.log(respuesta);
  
  // Extraemos el array de pacientes de la propiedad .data
  const pacientes = respuesta?.data || [];
  const meta = respuesta?.meta || null;

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const manejarCambioPagina = (nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const manejarCambioBusqueda = (valor) => {
    setBusqueda(valor);
    setPagina(1);
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const termino = busqueda.toLowerCase();
    return (
      p.nombre_completo?.toLowerCase().includes(termino) ||
      p.identificacion?.toLowerCase().includes(termino)
    );
  });

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
    pacientes,
    pacientesFiltrados,
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
