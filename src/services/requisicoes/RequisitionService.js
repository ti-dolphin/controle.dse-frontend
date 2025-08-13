//RequisitionService
import api from "../../api";
const API_ENDPOINT = '/requisicoes';
export default class RequisitionService {
    // Defina os métodos para interagir com a API de requisições
    static async getMany(user, params) {
        const response = await api.get(API_ENDPOINT, {
            params: { user, params }
        });
        return response.data;
    }
    static async getById(id_requisicao) {
        const response = await api.get(`${API_ENDPOINT}/${id_requisicao}`);
        return response.data;
    }
    static async create(data) {
        const response = await api.post(API_ENDPOINT, data);
        return response.data;
    }
    static async cancel(id_requisicao) {
        const response = await api.put(`${API_ENDPOINT}/${id_requisicao}/cancelar`);
        return response.data;
    }
    static async activate(id_requisicao) {
        const response = await api.put(`${API_ENDPOINT}/${id_requisicao}/ativar`);
        return response.data;
    }
    static async update(id_requisicao, data) {
        const response = await api.put(`${API_ENDPOINT}/${id_requisicao}`, data);
        return response.data;
    }
    static async delete(id_requisicao) {
        const response = await api.delete(`${API_ENDPOINT}/${id_requisicao}`);
        return response.data;
    }
}
