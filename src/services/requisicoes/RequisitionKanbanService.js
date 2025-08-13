import api from "../../api";
const ENDPOINT = "requisicao_kanban";
const RequisitionKanbanService = {
    async create(data) {
        const response = await api.post(`/${ENDPOINT}`, data);
        return response.data;
    },
    async getMany(query) {
        const response = await api.get(`/${ENDPOINT}`, {
            params: query,
        });
        return response.data;
    },
    async getById(id_kanban_requisicao) {
        try {
            const response = await api.get(`/${ENDPOINT}/${id_kanban_requisicao}}`);
            return response.data;
        }
        catch (error) {
            if (error.response && error.response.status === 404)
                return null;
            throw error;
        }
    },
    async update(id_kanban_requisicao, data) {
        const response = await api.put(`/${ENDPOINT}/${id_kanban_requisicao}`, data);
        return response.data;
    },
    async delete(id_kanban_requisicao) {
        await api.delete(`/${ENDPOINT}/${id_kanban_requisicao}`);
    }
};
export default RequisitionKanbanService;
