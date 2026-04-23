import React from 'react';
import TarjetaEstadistica from '../components/TarjetaEstadistica';
import FilaVisita from '../components/FilaVisita';
import ItemActividad from '../components/ItemActividad';
import { useDashboardQuery } from '../queries/useDashboardQuery';
import { Briefcase, ShieldCheck, Activity, Clock, Users } from 'lucide-react';
import { DASHBOARD_STATS_CONFIG } from '../constants/dashboardStats';


export default function PanelPage() {
  const { data, isLoading, isError } = useDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Cargando panel...</span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-red-500 font-bold p-8 text-center bg-red-50 border border-red-100 rounded-2xl max-w-sm">
          Ocurrió un error cargando los datos del dashboard.
        </div>
      </div>
    );
  }

  const kpis = data.kpis_operativos || {};
  const sumVisitasHoy = (kpis.visitas_hoy || []).reduce((acc, curr) => acc + curr.cantidad, 0);

  const estadisticas = DASHBOARD_STATS_CONFIG.map(stat => ({
    ...stat,
    valor: stat.id === 'visitas_hoy' 
      ? sumVisitasHoy.toString() 
      : (kpis[stat.id] || '0').toString()
  }));


  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">Panel de Control</h1>
        <p className="text-sm font-medium text-[#6B7280] mt-1 tracking-tight">Gestión operativa y visión de red en tiempo real</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {estadisticas.map((tarjeta, indice) => (
          <TarjetaEstadistica key={indice} {...tarjeta} />
        ))}
      </div>

      {/* Nueva Fila: Gestión Visitas y Aseguradoras (Asimétrica) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card 1: Carga Profesionales (Más ancha) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-gray-900 text-lg leading-none">Carga de Trabajo</h3>
            <Briefcase size={20} className="text-blue-500" />
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[300px]">
            {data.gestion_visitas?.carga_profesionales?.map((prof, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[12px] font-black text-gray-700 uppercase truncate max-w-[210px] group-hover:text-blue-600 transition-colors uppercase">{prof.nombre_completo}</span>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">{prof.total_visitas_asignadas}</span>
                </div>
                <div className="w-full bg-gray-50 h-2 rounded-full border border-gray-100 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((prof.total_visitas_asignadas / 60) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Aseguradoras */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-gray-900 text-lg leading-none">Demografía EPS</h3>
            <ShieldCheck size={20} className="text-emerald-500" />
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[300px]">
            {data.demografia?.pacientes_aseguradora?.map((aseg, i) => (
              <div key={i} className="flex flex-col gap-2 group">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-black text-gray-500 uppercase group-hover:text-emerald-600 transition-colors leading-none">{aseg.aseguradora}</span>
                  <span className="text-[13px] font-black text-gray-900 leading-none">{aseg.total_pacientes} <span className="text-[9px] text-gray-400 font-bold ml-0.5">PACS</span></span>
                </div>
                <div className="w-full bg-gray-50 h-2 rounded-full border border-gray-100 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(aseg.total_pacientes / (data.kpis_operativos?.pacientes_activos || 1000)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nueva Fila 4: Pirámide y Especialidades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Pirámide */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-gray-900 text-lg leading-none">Pirámide Poblacional</h3>
            <Users size={20} className="text-purple-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 flex-1">
            {data.demografia?.piramide_poblacional?.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[12px] shadow-sm ${item.sexo === 'M' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                  {item.sexo}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.rango_edad}</span>
                    <span className="text-[14px] font-black text-gray-900">{item.cantidad}</span>
                  </div>
                  <div className="w-full bg-gray-50 h-2 rounded-full border border-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${item.sexo === 'M' ? 'bg-blue-400' : 'bg-pink-400'}`} style={{ width: `${Math.min((item.cantidad / 50) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Especialidades */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-gray-900 text-lg leading-none">Visitas por Especialidad</h3>
            <Activity size={20} className="text-amber-500" />
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar max-h-[300px] pr-2">
            {data.gestion_visitas?.visitas_especialidad?.map((spec, i) => (
              <div key={i} className="flex flex-col gap-3 group">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest group-hover:text-amber-600 transition-colors leading-none">{spec.especialidad}</span>
                  <span className="text-[14px] font-black text-gray-900 leading-none">{spec.total_visitas} <span className="text-[9px] text-gray-400 font-bold ml-1 uppercase">Visitas</span></span>
                </div>
                <div className="w-full bg-gray-50 h-2.5 rounded-full border border-gray-100 overflow-hidden border">
                  <div className="bg-gradient-to-r from-amber-300 to-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((spec.total_visitas / 600) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
