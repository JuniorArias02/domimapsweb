import { useState, useCallback } from 'react';
import { 
  useAutorizacionesQuery, 
  useCrearAutorizacionMutation, 
  useActualizarAutorizacionMutation, 
  useEliminarAutorizacionMutation 
} from '../queries/useAutorizacionesQuery';

/**
 * Hook de lógica de UI para la gestión de autorizaciones.
 */
export function useAutorizaciones(idPaciente) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [autorizacionSeleccionada, setAutorizacionSeleccionada] = useState(null);

  const { 
    data: respuesta, 
    isLoading, 
    isError, 
    error, 
    isFetching 
  } = useAutorizacionesQuery(idPaciente);

  const crearMutation = useCrearAutorizacionMutation();
  const actualizarMutation = useActualizarAutorizacionMutation();
  const eliminarMutation = useEliminarAutorizacionMutation();

  const autorizaciones = respuesta?.data || [];

  const abrirModalCrear = useCallback(() => {
    setAutorizacionSeleccionada(null);
    setModalAbierto(true);
  }, []);

  const abrirModalEditar = useCallback((autorizacion) => {
    setAutorizacionSeleccionada(autorizacion);
    setModalAbierto(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setAutorizacionSeleccionada(null);
  }, []);

  const manejarGuardar = async (datos) => {
    if (autorizacionSeleccionada) {
      await actualizarMutation.mutateAsync({ 
        id: autorizacionSeleccionada.id_ingreso, 
        datos 
      });
    } else {
      await crearMutation.mutateAsync({ ...datos, id_paciente: idPaciente });
    }
    cerrarModal();
  };

  const manejarEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta autorización?')) {
      await eliminarMutation.mutateAsync(id);
    }
  };

  return {
    autorizaciones,
    isLoading,
    isError,
    error,
    isFetching,
    modalAbierto,
    autorizacionSeleccionada,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    manejarGuardar,
    manejarEliminar,
  };
}
