import React from 'react';
import { Home, Users, Calendar, FileText, Settings, Bell, LogOut, Search, Activity, Heart, Clock } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { name: 'Pacientes Activos', value: '128', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Citas Hoy', value: '12', icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Historias Pendientes', value: '8', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Alertas Médicas', value: '2', icon: Activity, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center">
              <Heart className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-[#111827]">Domiciliaria</span>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem icon={Home} label="Dashboard" active />
            <SidebarItem icon={Users} label="Pacientes" />
            <SidebarItem icon={Calendar} label="Agenda" />
            <SidebarItem icon={FileText} label="Documentos" />
            <div className="pt-4 mt-4 border-t border-gray-100">
              <SidebarItem icon={Settings} label="Configuración" />
            </div>
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold">
              {user?.nombre_completo?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.nombre_completo || 'Administrador'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.rol?.nombre || 'ADMINISTRADOR'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full mt-4 flex items-center gap-2 p-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="relative w-96 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar paciente, ID, cita..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Panel de Control</h1>
            <p className="text-[#6B7280]">Gestión integral de atención domiciliaria</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Patients Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden pt-6">
              <div className="px-6 mb-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg">Próximas Visitas</h3>
                <button className="text-sm font-bold text-[#2563EB] hover:underline">Ver todas</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Servicio</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <PatientRow name="Juan Pérez" service="Auditoría" time="14:00" status="Confirmado" statusColor="text-green-600 bg-green-50" />
                    <PatientRow name="Maria García" service="Curación" time="15:30" status="En camino" statusColor="text-blue-600 bg-blue-50" />
                    <PatientRow name="Andrés Lopez" service="Inyectología" time="16:45" status="Pendiente" statusColor="text-gray-600 bg-gray-50" />
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-6">Actividad Reciente</h3>
              <div className="space-y-6">
                <ActivityItem label="Nuevo paciente registrado" time="Hace 10 min" icon={Users} color="bg-blue-50 text-blue-600" />
                <ActivityItem label="Visita completada ID-294" time="Hace 1 hora" icon={Calendar} color="bg-green-50 text-green-600" />
                <ActivityItem label="Historia clínica actualizada" time="Hace 2 horas" icon={FileText} color="bg-purple-50 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      active 
        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}>
      <Icon size={20} />
      {label}
    </button>
  );
}

function StatCard({ name, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500">{name}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function PatientRow({ name, service, time, status, statusColor }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            {name.charAt(0)}
          </div>
          <span className="text-sm font-bold text-gray-900">{name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{service}</td>
      <td className="px-6 py-4 text-sm text-gray-900 font-bold">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400" />
          {time}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${statusColor}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

function ActivityItem({ label, time, icon: Icon, color }) {
  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-xs font-medium text-gray-500">{time}</p>
      </div>
    </div>
  );
}
