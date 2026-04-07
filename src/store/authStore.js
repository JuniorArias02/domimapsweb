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

const useAuthStore = create((set) => ({
  user: null,
  token: savedToken || null,
  isAuthenticated: !!isInitialAuthenticated,
  
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  setUser: (user) => set({ user }),

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
