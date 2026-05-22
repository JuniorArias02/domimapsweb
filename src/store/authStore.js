import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

const savedToken = localStorage.getItem('token');
const isInitialAuthenticated = savedToken && !isTokenExpired(savedToken);

let savedUser = null;
if (isInitialAuthenticated) {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      savedUser = JSON.parse(userStr);
    } else if (savedToken) {
      // Auto-recuperación de datos desde el token JWT decodificado
      const decoded = jwtDecode(savedToken);
      savedUser = {
        id_usuario: decoded.id_usuario || decoded.sub,
        nombre_completo: decoded.nombre_completo || 'Usuario',
        email: decoded.email,
        rol: {
          id_rol: decoded.id_rol,
          nombre: decoded.id_rol === 2 ? 'ADMINISTRADOR' : 'COLABORADOR'
        }
      };
      // Guardamos en localStorage para evitar decodificar en el futuro
      localStorage.setItem('user', JSON.stringify(savedUser));
    }
  } catch (error) {
    console.error('Error parsing user from localStorage or JWT token:', error);
  }
}

const useAuthStore = create((set) => ({
  user: savedUser,
  token: savedToken || null,
  isAuthenticated: !!isInitialAuthenticated,
  
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  checkTokenExpiration: () => {
    const { token } = useAuthStore.getState();
    if (isTokenExpired(token)) {
      useAuthStore.getState().logout();
      return true;
    }
    return false;
  }
}));

export default useAuthStore;
