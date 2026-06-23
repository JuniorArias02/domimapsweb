import React from 'react';
import { usePersonalQuery } from '../queries/usePersonalQuery';
import { useNavigate } from 'react-router-dom';
import { Users, UserCircle } from 'lucide-react';

export const PersonalListPage = () => {
  const { data: personal = [], isLoading, isError } = usePersonalQuery();
  const navigate = useNavigate();

  // Ensuring data is an array just in case the backend returns something else
  const personalArray = Array.isArray(personal) ? personal : (personal.data || []);

  return (
    <div className="p-8 max-w-8xl mx-auto space-y-6"> 
      <div className="flex items-center gap-3"> 
        <Users className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">Personal Médico</h1>
      </div>
      <p className="text-gray-600">Listado de profesionales registrados en el sistema.</p>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200">
          Error al cargar el personal.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalArray.map((p) => (
            <div 
              key={p.id_personal} 
              onClick={() => navigate(`/personal/${p.id_personal}`, { state: { nombre: p.nombre_completo } })}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 cursor-pointer hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
                 <UserCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg uppercase">{p.nombre_completo || 'Profesional'}</h3>
                <p className="text-sm text-gray-500 font-medium">
                  {p.tipo_documento ? `${p.tipo_documento} ${p.numero_documento}` : (p.especialidad || p.tipo_profesional || 'Profesional')}
                </p>
              </div>
            </div>
          ))}
          {personalArray.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 shadow-sm">
              No hay personal registrado en este momento o no hay datos para mostrar.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
