import api from "../../api";

const API_ENDPOINT = '/oportunidades';

const OpportunityService = {
    getById: async (CODOS: string) => {
        const response = await api.get(`${API_ENDPOINT}/${CODOS}`);
        return response.data;
    },
    getMany: async () => {
        const response = await api.get(API_ENDPOINT);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post(API_ENDPOINT, data);
        return response.data;
    },
    update: async (CODOS: string, data: any) => {
        const response = await api.put(`${API_ENDPOINT}/${CODOS}`, data);
        return response.data;
    },
    delete: async (CODOS: string) => {
        const response = await api.delete(`${API_ENDPOINT}/${CODOS}`);
        return response.data;
    }
}

export default OpportunityService;
