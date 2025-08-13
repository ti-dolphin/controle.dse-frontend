import api from "../../api";
const API_ENDPOINT = '/status_requisicao';
const API_PERMISSION_ENDPOINT = "permissao_status";
class RequisitionStatusService {
    async getMany() {
        const response = await api.get(API_ENDPOINT);
        return response.data;
    }
    async getById(id_status_requisicao) {
        const response = await api.get(`${API_ENDPOINT}/${id_status_requisicao}`);
        return response.data;
    }
    async getStatusPermissions(user, requisition) {
        const response = await api.get(`${API_ENDPOINT}/${API_PERMISSION_ENDPOINT}`, {
            params: { user, requisition },
        });
        return response.data;
    }
    async getStatusAlterationsByRequisitionId(id_requisicao) {
        const response = await api.get(`${API_ENDPOINT}/alteracao`, {
            params: { id_requisicao },
        });
        return response.data;
    }
    async create(data) {
        const response = await api.post(API_ENDPOINT, data);
        return response.data;
    }
    async update(id_status_requisicao, data) {
        const response = await api.put(`${API_ENDPOINT}/${id_status_requisicao}`, data);
        return response.data;
    }
    async delete(id_status_requisicao) {
        await api.delete(`${API_ENDPOINT}/${id_status_requisicao}`);
    }
}
export default new RequisitionStatusService();
