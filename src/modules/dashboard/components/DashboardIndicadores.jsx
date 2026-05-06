import React from 'react';
import { useIndicadoresQuery } from '../queries/useIndicadoresQuery';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ClipboardList, CheckCircle, Clock, AlertTriangle, List, Calendar } from 'lucide-react';

export default function DashboardIndicadores() {
  const { data, isLoading, isError } = useIndicadoresQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">Cargando indicadores...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 font-bold p-8 text-center bg-red-50 border border-red-100 rounded-2xl max-w-sm">
          No se pudieron cargar los indicadores de gestión.
        </div>
      </div>
    );
  }

  // Preparar datos para el gráfico de barras (Agendas vs Atendidos)
  const chartData = [
    { name: 'Agendadas', valor: data.total_agendas, color: '#2563EB' },
    { name: 'Atendidas', valor: data.total_atendidos, color: '#16A34A' },
  ];

  // Datos para el gráfico circular (Proporción)
  const pieData = [
    { name: 'Atendidos', value: data.total_atendidos, color: '#16A34A' },
    { name: 'Pendientes', value: data.total_agendas - data.total_atendidos, color: '#E5E7EB' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      
      {/* 1. KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IndicadorCard 
          titulo="Total Agendas" 
          valor={data.total_agendas} 
          icon={<ClipboardList className="text-blue-500" />} 
          color="bg-blue-50"
          subtexto="Total histórico/mes"
        />
        <IndicadorCard 
          titulo="Atendidos" 
          valor={data.total_atendidos} 
          icon={<CheckCircle className="text-emerald-500" />} 
          color="bg-emerald-50"
          subtexto={`${((data.total_atendidos / data.total_agendas) * 100).toFixed(1)}% completado`}
        />
        <IndicadorCard 
          titulo="Próximas" 
          valor={data.total_proximas} 
          icon={<Clock className="text-amber-500" />} 
          color="bg-amber-50"
          subtexto="Visitas programadas"
        />
        <IndicadorCard 
          titulo="A Vencer" 
          valor={data.total_a_vencer} 
          icon={<AlertTriangle className="text-red-500" />} 
          color={data.total_a_vencer > 0 ? "bg-red-50" : "bg-gray-50"}
          subtexto="Atención prioritaria"
        />
      </div>

      {/* 2. Sección de Gráficos y Listado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico de Barras: Rendimiento */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-gray-900 text-lg leading-none">Rendimiento de Agendas</h3>
              <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-widest">Comparativa: Agendado vs Ejecutado</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl">
              <List size={20} className="text-blue-600" />
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="valor" radius={[10, 10, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Listado a Vencer */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-gray-900 text-lg leading-none">Alertas de Vencimiento</h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${data.total_a_vencer > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {data.total_a_vencer} alertas
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[300px]">
            {data.listado_a_vencer && data.listado_a_vencer.length > 0 ? (
              data.listado_a_vencer.map((item, i) => (
                <div key={i} className="group p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-red-200 hover:bg-red-50/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">ID Visita #{item.id_visita}</span>
                    <div className="flex items-center gap-1 text-red-500">
                       <AlertTriangle size={12} />
                       <span className="text-[10px] font-black">Hoy</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Calendar size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-gray-800">Orden #{item.id_orden_servicio}</p>
                      <p className="text-[11px] font-bold text-gray-500 uppercase">{item.fecha_programada}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="p-4 bg-emerald-50 rounded-full mb-4">
                  <CheckCircle className="text-emerald-500" size={32} />
                </div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">¡Todo al día!</p>
                <p className="text-[10px] text-gray-400 font-medium mt-1">No hay visitas por vencer hoy.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Interno para las Cards de Indicadores
function IndicadorCard({ titulo, valor, icon, color, subtexto }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1 group-hover:text-gray-500 transition-colors">{titulo}</p>
          <h4 className="text-3xl font-black text-gray-900 tracking-tight">{valor.toLocaleString()}</h4>
          <p className="text-[10px] font-bold text-gray-400 mt-2 flex items-center gap-1 uppercase tracking-widest">
            {subtexto}
          </p>
        </div>
        <div className={`p-4 ${color} rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500`}>
          {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
      </div>
      
      {/* Elemento decorativo */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity`} />
    </div>
  );
}
