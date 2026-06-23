import React, { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePersonalEstadisticas, usePersonalIngresos } from '../queries/usePersonalQuery';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  ArrowLeft, Activity, Calendar, FileText, ClipboardList, CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

export const PersonalProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const nombreProfesional = location.state?.nombre || 'Perfil del Profesional';

  const { data: statsData, isLoading: isLoadingStats } = usePersonalEstadisticas(id);
  const { data: ingresosData, isLoading: isLoadingIngresos } = usePersonalIngresos(id);

  const stats = statsData?.data;
  const ingresos = ingresosData?.data || [];

  // Pie chart calculation
  const pieData = useMemo(() => {
    if (!stats?.cumplimiento_estados) return [];
    return stats.cumplimiento_estados.map(item => ({
      name: item.estado,
      value: item.cantidad
    }));
  }, [stats]);

  const COLORS = ['#16A34A', '#EF4444', '#F59E0B', '#3B82F6', '#6B7280'];

  const totalVisitas = pieData.reduce((acc, curr) => acc + curr.value, 0);
  const completadas = pieData.find(d => d.name === 'COMPLETADA')?.value || 0;
  const porcentajeCompletadas = totalVisitas > 0 ? Math.round((completadas / totalVisitas) * 100) : 0;

  return (
    <div className="p-8 w-full max-w-8xl mx-auto space-y-8 bg-[#F9FAFB] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 uppercase">{nombreProfesional}</h1>
          <p className="text-gray-500">Métricas de cumplimiento y asignaciones</p>
        </div>
      </div>

      {isLoadingStats || isLoadingIngresos ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Top Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="bg-green-50 p-4 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Cumplimiento General</p>
                <p className="text-3xl font-bold text-gray-900">{porcentajeCompletadas}%</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="bg-blue-50 p-4 rounded-xl">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Visitas (Histórico)</p>
                <p className="text-3xl font-bold text-gray-900">{totalVisitas}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="bg-orange-50 p-4 rounded-xl">
                <ClipboardList className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Ingresos Asignados</p>
                <p className="text-3xl font-bold text-gray-900">{ingresos.length}</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Cumplimiento Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-400" />
                Estado de Visitas
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm text-gray-600 font-medium">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitas por Mes Line/Bar Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                Progresión Mensual
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.visitas_por_mes || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                    <RechartsTooltip 
                      cursor={{fill: '#F3F4F6'}}
                      contentStyle={{borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="cantidad" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Bottom Section: Pacientes & Ingresos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Visitas por paciente Table/Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col transition-all hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Pacientes Atendidos
              </h3>
              <div className="space-y-4 overflow-y-auto flex-1 max-h-[400px] pr-2">
                {stats?.visitas_por_paciente?.map((vp) => (
                  <div key={vp.id_paciente} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">{vp.nombre_completo}</p>
                      <p className="text-sm text-gray-500">ID: {vp.id_paciente}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{vp.total_visitas}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Visitas</p>
                    </div>
                  </div>
                ))}
                {(!stats?.visitas_por_paciente || stats.visitas_por_paciente.length === 0) && (
                  <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center">
                    <FileText className="w-10 h-10 text-gray-300 mb-3" />
                    No hay registros de pacientes
                  </div>
                )}
              </div>
            </div>

            {/* Historial de Ingresos Asignados Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-gray-400" />
                  Historial de Ingresos Asignados
                </h3>
              </div>
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4">Ingreso / Auth</th>
                      <th className="px-6 py-4">Paciente</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ingresos.map((ingreso) => (
                      <tr key={ingreso.id_ingreso} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">#{ingreso.ingreso}</p>
                          <p className="text-gray-500 text-xs font-medium">{ingreso.autorizacion}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{ingreso.nombre_paciente}</p>
                          <p className="text-gray-500 text-xs">{ingreso.tipo_documento} {ingreso.identificacion_paciente}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">
                          {new Date(ingreso.fecha_ingreso).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={clsx(
                            "px-3 py-1 rounded-full text-xs font-bold tracking-wide",
                            ingreso.estado_paciente === 'ACTIVO' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          )}>
                            {ingreso.estado_paciente}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {ingresos.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <ClipboardList className="w-10 h-10 text-gray-300 mb-3" />
                            No hay ingresos asignados
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
