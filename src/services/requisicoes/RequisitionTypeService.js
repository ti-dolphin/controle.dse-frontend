import api from '../../api';
const API_ENDPOINT = '/tipo_requisicao';
export class RequisitionTypeService {
    static async getMany() {
        const response = await api.get(API_ENDPOINT);
        return response.data;
    }
    static async getById(id) {
        const response = await api.get(`${API_ENDPOINT}/${id}`);
        return response.data;
    }
    static async create(data) {
        const response = await api.post(API_ENDPOINT, data);
        return response.data;
    }
    static async update(id, data) {
        const response = await api.put(`${API_ENDPOINT}/${id}`, data);
        return response.data;
    }
    static async delete(id) {
        await api.delete(`${API_ENDPOINT}/${id}`);
    }
}
