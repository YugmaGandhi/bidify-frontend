import axios from 'axios';

// Create Instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptors
api.interceptors.request.use((config) => {
    // In Next.js, we usually store token in Cookies or LocalStorage
    // TODO: For now, let's assume LocalStorage for simplicity (we'll upgrade to Cookies later)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Barer ${token}`;
        }
    }

    return config;
});

// Response Interceptor (Handle Errors)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If 401 (Unauthorised) kick user out
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;