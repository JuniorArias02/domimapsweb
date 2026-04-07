import React, { useState } from 'react';
import { useLogin } from '../queries/useAuth';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        {/* Header Decorator */}
        <div className="h-2 w-full bg-[#2563EB]" />
        
        <div className="p-8 sm:p-12">
          {/* Logo / Title Area */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-6 shadow-sm">
              <Lock className="w-10 h-10 text-[#2563EB]" />
            </div>
            <h1 className="text-3xl font-bold text-[#111827] tracking-tight mb-2">
              Bienvenido de nuevo
            </h1>
            <p className="text-[#6B7280] font-medium">
              Accede a tu panel de atención domiciliaria
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-shake">
                Credenciales inválidas. Por favor intente de nuevo.
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827] ml-1" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all duration-200"
                  placeholder="admin@domiciliaria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-[#111827]" htmlFor="password">
                  Contraseña
                </label>
                <button type="button" className="text-sm font-semibold text-[#2563EB] hover:text-[#1E40AF] transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all duration-200"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-[#2563EB] bg-gray-50 border-gray-300 rounded focus:ring-[#2563EB]/20"
              />
              <label htmlFor="remember" className="ml-2 text-sm font-medium text-[#6B7280] select-none">
                Recordar dispositivo
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center py-4 px-4 bg-[#2563EB] hover:bg-[#1E40AF] disabled:bg-blue-300 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all duration-150 group"
            >
              {isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center">
                  Iniciar Sesión
                  <Lock className="ml-2 w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[#6B7280]">
              ¿Nuevo en el sistema?{' '}
              <button className="text-[#2563EB] font-bold hover:underline">
                Contactar soporte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
