import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User, ShieldCheck, CreditCard } from 'lucide-react';
import { useAutorizaciones } from '../hooks/useAutorizaciones';
import { usePacienteDetalleQuery } from '../queries/usePacientesQuery';
import AutorizacionTable from '../components/AutorizacionTable';
import AutorizacionForm from '../components/AutorizacionForm';
import OrdenesMedicasModal from '../components/OrdenesMedicasModal';

const AutorizacionPages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para el modal de órdenes médicas
  const [modalOrdenesAbierto, setModalOrdenesAbierto] = React.useState(false);
  const [idIngresoSeleccionado, setIdIngresoSeleccionado] = React.useState(null);

  const abrirModalOrdenes = (idIngreso) => {
    setIdIngresoSeleccionado(idIngreso);
    setModalOrdenesAbierto(true);
  };
  
  // Intentamos obtener el paciente del estado de la navegación (datos reciclados)
  const pacienteDesdeState = location.state?.paciente;

  // Consulta de respaldo (aunque de error 405, usaremos el state si existe)
  const { data: respPaciente, isLoading: isLoadingPaciente } = usePacienteDetalleQuery(id, {
    enabled: !pacienteDesdeState // Solo ejecutar si no tenemos los datos del state
  });

  // Prioridad: 1. State de navegación, 2. Respuesta API, 3. Datos anidados
  const paciente = pacienteDesdeState || respPaciente?.data || respPaciente;
  const cargandoCualquiera = isLoadingPaciente && !pacienteDesdeState;

  const { 
    autorizaciones, 
    isLoading, 
    modalAbierto,
    autorizacionSeleccionada,
    abrirModalCrear, 
    abrirModalEditar, 
    cerrarModal,
    manejarGuardar,
    manejarEliminar,
    isFetching 
  } = useAutorizaciones(id);

  console.log('--- DEPURACIÓN ÓRDENES ---');
  console.log('Lista de Autorizaciones:', autorizaciones);
  console.log('ID Ingreso Seleccionado para Modal:', idIngresoSeleccionado);
  
  const nombrePaciente = paciente?.nombre_completo?.trim() || 'Paciente';

  return (
    <div className="space-y-6">
      {/* Botón Volver y Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/pacientes')}
          className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Autorizaciones</h1>
          <p className="text-sm text-gray-500">Maneja los documentos autorizados para el ingreso domiciliario</p>
        </div>
      </div>

      {/* Header Info del Paciente */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ShieldCheck size={120} className="text-blue-600" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
            <User size={32} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
               <h2 className="text-xl font-black text-gray-900 uppercase leading-none">
                 {cargandoCualquiera ? 'Cargando...' : nombrePaciente}
               </h2>
               <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                 paciente?.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
               }`}>
                 {paciente?.estado || '---'}
               </span>
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 pt-1">
              {/* Documento */}
              <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">
                  {paciente?.tipo_documento || '---'}
                </span>
                <span className="font-bold">{paciente?.identificacion || '---'}</span>
              </div>

              {/* Régimen */}
              <div className="flex items-center gap-1.5 text-gray-500 text-sm border-l border-gray-200 pl-4">
                <ShieldCheck size={14} className="text-blue-500" />
                <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Régimen:</span>
                <span className="font-bold text-gray-700">{paciente?.regimen || '---'}</span>
              </div>

              {/* Aseguradora */}
              <div className="flex items-center gap-1.5 text-gray-500 text-sm border-l border-gray-200 pl-4">
                <CreditCard size={14} className="text-green-500" />
                <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Aseguradora:</span>
                <span className="font-bold text-gray-700">{paciente?.aseguradora?.nombre || '---'}</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 flex flex-col justify-center">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ID PACIENTE</p>
             <p className="text-lg font-black text-gray-900 leading-none">#{id}</p>
          </div>
        </div>
      </div>

      {/* Tabla de Autorizaciones */}
      <AutorizacionTable 
        autorizaciones={autorizaciones} 
        isLoading={isLoading}
        onCrear={abrirModalCrear}
        onEditar={abrirModalEditar}
        onEliminar={manejarEliminar}
        onVerOrdenes={abrirModalOrdenes}
      />

      <AutorizacionForm 
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        onGuardar={manejarGuardar}
        autorizacion={autorizacionSeleccionada}
        cargando={isFetching}
      />

      <OrdenesMedicasModal
        abierto={modalOrdenesAbierto}
        onCerrar={() => setModalOrdenesAbierto(false)}
        idIngreso={idIngresoSeleccionado}
      />
    </div>
  );
};

export default AutorizacionPages;
