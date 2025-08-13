import api from "../../api";
const API_ENDPOINT = "/movimentacao_patrimonio";
class MovementationService {
    static async create(data) {
        const response = await api.post(API_ENDPOINT, data);
        return response.data;
    }
    static async getMany(params) {
        const response = await api.get(API_ENDPOINT, { params });
        return response.data;
    }
    static async getById(id_movimentacao) {
        const response = await api.get(`${API_ENDPOINT}/${id_movimentacao}`);
        return response.data;
    }
    static async update(id_movimentacao, data) {
        const response = await api.put(`${API_ENDPOINT}/${id_movimentacao}`, data);
        return response.data;
    }
    static async delete(id_movimentacao) {
        const response = await api.delete(`${API_ENDPOINT}/${id_movimentacao}`);
        return response.data;
    }
}
export default MovementationService;
