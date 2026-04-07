import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor for request: add token to headers
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor for response: handle 401 Unauthorized errors and token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no estamos en la página de login
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        // Obtenemos el token actual para enviarlo en el refresh si es necesario
        const currentToken = useAuthStore.getState().token;
        
        // Llamada al endpoint de refresh (comúnmente /auth/refresh)
        api.post('/auth/refresh', {}, {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        })
          .then(({ data }) => {
            const newToken = data.token || data.access_token; // Ajustar según lo que devuelva tu API
            const user = useAuthStore.getState().user;

            // Actualizamos el store con el nuevo token
            useAuthStore.getState().setAuth(user, newToken);
            
            // Reintentamos la petición original
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
            
            processQueue(null, newToken);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            
            // Si el refresh falla, cerramos sesión
            const { logout } = useAuthStore.getState();
            logout();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;

