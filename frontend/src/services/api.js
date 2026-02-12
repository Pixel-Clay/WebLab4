import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  responseType: 'json',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Unauthorized access');
      }
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};

const register = (username, password) => {
  return api.post('/auth/register', { username, password });
};

const logout = () => {
  return api.post('/auth/logout');
};

const checkAuth = () => {
  return api.get('/auth/check');
};

const checkPoint = (x, y, r) => {
  return api.post('/points/check', { x, y, r });
};

const checkPointFromClick = (x, y, r) => {
  return api.post('/points/check-click', { x, y, r });
};

const getHistory = (offset = 0, limit = 20) => {
  return api.get('/points/history', {
    params: { offset, limit }
  });
};

const clearHistory = () => {
  return api.delete('/points/clear');
};

export { login, register, logout, checkAuth, checkPoint, checkPointFromClick, getHistory, clearHistory };
export default api;


