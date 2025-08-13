// controle.dse-frontend/src/services/requisicoes/RequisitionCommentService.ts
import api from "../../api";
class RequisitionCommentService {
    static async getMany(params) {
        const response = await api.get("/comentarios_requisicao", { params });
        return response.data;
    }
    static async getById(id) {
        const response = await api.get(`/comentarios_requisicao/${id}`);
        return response.data;
    }
    static async create(data) {
        const response = await api.post("/comentarios_requisicao", data);
        return response.data;
    }
    static async update(id, data) {
        const response = await api.put(`/comentarios_requisicao/${id}`, data);
        return response.data;
    }
    static async delete(id) {
        const response = await api.delete(`/comentarios_requisicao/${id}`);
        return response.data;
    }
}
export default RequisitionCommentService;
