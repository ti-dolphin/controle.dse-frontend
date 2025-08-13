import api from "../../api";

const API_ENDPOINT = '/oportunidades';

const OpportunityService = {
    getById: async (CODOS: number) => {
        const response = await api.get(`${API_ENDPOINT}/${CODOS}`);
        return response.data;
    },
    getMany: async (params: any) => {
        const response = await api.get(API_ENDPOINT, {
            params
        });
        return response.data;
    },

    getOppStatusOptions: async () => {
        const response = await api.get(`${API_ENDPOINT}/status/status_oportunidade`);
        return response.data;
    },

    getReportInfo: async () => {
        const response = await api.get(
          `${API_ENDPOINT}/relatorio/verificar_relatorio_semanal`
        );
        return response.data;
    },
    create: async (data: any, params: any) => {
        const response = await api.post(API_ENDPOINT, data, { 
            params: params
        });
        return response.data;
    },
    update: async (CODOS: number, data: any) => {
        const response = await api.put(`${API_ENDPOINT}/${CODOS}`, data);
        return response.data;
    },
    delete: async (CODOS: number) => {
        const response = await api.delete(`${API_ENDPOINT}/${CODOS}`);
        return response.data;
    }
}

export default OpportunityService;
