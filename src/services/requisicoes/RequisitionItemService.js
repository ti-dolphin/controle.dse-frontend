import api from '../../api';
const API_ENDPOINT = '/item_requisicao';
export class RequisitionItemService {
    static async getMany(params) {
        const response = await api.get(API_ENDPOINT, { params });
        return response.data;
    }
    static async getById(id) {
        const response = await api.get(`${API_ENDPOINT}/${id}`);
        return response.data;
    }
    static async getDinamicColumns(id_requisicao) {
        const response = await api.get(`${API_ENDPOINT}/columns/${id_requisicao}`);
        return response.data;
    }
    static async create(data) {
        const response = await api.post(API_ENDPOINT, data);
        return response.data;
    }
    static async createMany(productIds, id_requisicao) {
        const response = await api.post(`${API_ENDPOINT}/many`, productIds, {
            params: { id_requisicao },
        });
        return response.data;
    }
    static async update(id, data) {
        const response = await api.put(`${API_ENDPOINT}/${id}`, data);
        return response.data;
    }
    static async updateQuoteItemsSelected(id_requisicao, data) {
        const response = await api.put(`${API_ENDPOINT}/itens_cotacao_selecionados/update`, data, {
            params: { id_requisicao },
        });
        return response.data;
    }
    static async updateOCS(ids, oc) {
        const response = await api.put(`${API_ENDPOINT}/ocs/update`, {
            ids,
            oc: Number(oc),
        });
        return response.data;
    }
    static updateShippingDate = async (ids, date) => {
        const response = await api.put(`${API_ENDPOINT}/shipping_date/update`, {
            ids,
            date,
        });
        return response.data;
    };
    static async delete(id) {
        await api.delete(`${API_ENDPOINT}/${id}`);
    }
}
export default RequisitionItemService;
