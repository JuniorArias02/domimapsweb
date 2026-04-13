import React from 'react';
import { CrearAgendaForm } from '../components/CrearAgendaForm';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CrearAgendaPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header de la página */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 shadow-inner">
            <CalendarDays size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nueva Agenda</h1>
            <p className="text-gray-500 font-medium">Programación de sesiones domiciliarias</p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/agenda')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver al Listado
        </button>
      </div>

      {/* Formulario de Creación (UI) */}
      <CrearAgendaForm />
    </div>
  );
}
