import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || ""
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            // TODO: clear token and navigate to index on any auth errors
            // clearToken();
            // navigate('/'); // or window.location.href = '/';
        }
        return Promise.reject(err);
    }
);

export default api;