import React, { useState } from 'react';
import { useLogin } from '../queries/useAuth';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, Eye, EyeOff, MapPin, Stethoscope, ChevronRight } from 'lucide-react';
import loginMapBg from '../../../assets/images/login-map-bg.png';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function LoginPage() {
  const [email, setEmail] = useState('admin@domiciliaria.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password }, {
      onSuccess: () => {
        navigate('/dashboard');
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F9FAFB] font-sans">
      {/* Columna Izquierda - Branding e Imagen */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#2563EB]">
        <img 
          src={loginMapBg} 
          alt="Mapa de rutas domiciliarias" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF]/90 via-[#2563EB]/80 to-[#3B82F6]/60 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 w-full p-16 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 bg-white/10 w-fit p-3 px-5 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
              <div className="bg-white p-2 rounded-xl text-[#2563EB]">
                <Stethoscope size={24} />
              </div>
              <div>
                <h2 className="text-white font-black text-xl tracking-tight leading-none">Domimaps</h2>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">Control de rutas</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 max-w-lg mb-10">
            <h1 className="text-5xl font-black text-white leading-tight tracking-[-0.02em]">
              Geolocalización médica <br />a tu alcance
            </h1>
            <p className="text-blue-100/90 text-lg font-medium leading-relaxed">
              Optimización de rutas interactivas, gestión de visitas, y seguimiento de pacientes en tiempo real.
            </p>
            
            <div className="flex items-center gap-6 mt-12 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-sm w-fit shadow-xl">
               <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#2563EB] bg-blue-100 flex items-center justify-center shadow-md relative z-10" style={{ zIndex: 10 - i }}>
                       <MapPin size={16} className="text-[#2563EB] opacity-60" />
                    </div>
                  ))}
               </div>
               <div className="text-white">
                 <p className="text-2xl font-black">+5000</p>
                 <p className="text-[10px] font-bold uppercase text-blue-200 tracking-wider">Rutas Mensuales</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha - Formulario de Login */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-16 relative bg-white lg:bg-[#F9FAFB] lg:rounded-l-3xl shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.1)] z-20">
        
        {/* Adorno móvil visible solo en pantallas pequeñas */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-3">
          <div className="bg-[#2563EB]/10 p-2.5 rounded-xl text-[#2563EB]">
            <Stethoscope size={24} />
          </div>
          <div>
            <h2 className="text-[#111827] font-black text-xl tracking-tight leading-none">Domimaps</h2>
          </div>
        </div>

        <div className="w-full max-w-md mt-10 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-[#111827] tracking-tight mb-3">
              Bienvenido de nuevo
            </h2>
            <p className="text-[#6B7280] font-medium text-base">
              Ingresa tus credenciales corporativas para acceder al panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl text-red-700 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                Credenciales inválidas. Por favor intente de nuevo.
              </div>
            )}

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-14 pr-5 py-4 bg-white lg:bg-[#F9FAFB] border border-gray-200 rounded-2xl text-[#111827] font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all duration-300 shadow-sm"
                  placeholder="admin@domiciliaria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2.5">
               <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider" htmlFor="password">
                  Contraseña
                </label>
                <button type="button" className="text-[11px] font-bold text-[#2563EB] hover:text-[#1E40AF] transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-14 pr-12 py-4 bg-white lg:bg-[#F9FAFB] border border-gray-200 rounded-2xl text-[#111827] font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all duration-300 shadow-sm"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-[#111827] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4.5 h-4.5 text-[#2563EB] bg-white border-gray-300 rounded cursor-pointer focus:ring-[#2563EB]/20 transition-all"
              />
              <label htmlFor="remember" className="ml-3 text-sm font-medium text-[#6B7280] select-none cursor-pointer">
                Mantener sesión iniciada
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center py-4 px-4 bg-[#2563EB] hover:bg-[#1E40AF] disabled:bg-[#2563EB]/60 text-white text-[15px] font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-[#2563EB]/25 active:scale-[0.98] transition-all duration-200 group mt-4 hover:shadow-2xl hover:shadow-[#2563EB]/40 border border-[#2563EB]"
            >
              {isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Ingresar al sistema
                  <ChevronRight size={20} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center mt-12 gap-2 text-gray-400">
             <MapPin size={14} className="opacity-70" />
             <p className="text-center text-[11px] font-medium uppercase tracking-wider">
               Sistema Domiciliaria v2.0 • Acceso Autorizado
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
