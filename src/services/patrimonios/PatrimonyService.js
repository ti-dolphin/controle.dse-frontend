import api from "../../api";
export class PatrimonyService {
    static async getMany() {
        const response = await api.get(`/patrimonios`);
        return response.data;
    }
    static async getById(id_patrimonio) {
        const response = await api.get(`/patrimonios/${id_patrimonio}`);
        return response.data;
    }
    static async getTypes() {
        const reponse = await api.get(`/patrimonios/tipos/getAll`);
        return reponse.data;
    }
    static async update(id_patrimonio, data) {
        const response = await api.put(`/patrimonios/${id_patrimonio}`, data);
        return response.data;
    }
    static async create(data) {
        const response = await api.post(`/patrimonios`, data);
        return response.data;
    }
    static async delete(id_patrimonio) {
        const response = await api.delete(`/patrimonios/${id_patrimonio}`);
        if (response.status === 204)
            return true;
        return false;
    }
}
