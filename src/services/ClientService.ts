import api from '../api';

const ClientService = {
    getMany: async () => {
        const response = await api.get('/clientes');
        return response.data;
    },
    getById: async (CODCLIENTE: number) => {
        const response = await api.get(`/clientes/${CODCLIENTE}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/clientes', data);
        return response.data;
    },
    update: async (CODCLIENTE: number, data: any) => {
        const response = await api.put(`/clientes/${CODCLIENTE}`, data);
        return response.data;
    },
    delete: async (CODCLIENTE: number) => {
        const response = await api.delete(`/clientes/${CODCLIENTE}`);
        return response.data;
    }
};

export default ClientService;
