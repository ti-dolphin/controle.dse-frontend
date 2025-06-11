import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
    // baseURL: 'https://apicontrolehomologacao.dse.com.br',
    // baseURL: 'https://apicontrole.dse.com.br',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export default api;