// controle.dse-frontend/src/services/requisicoes/QuoteService.ts
import api from "../../api";
const API_ENDPOINT = "/cotacoes";
class QuoteService {
    static async getMany(params) {
        const response = await api.get(API_ENDPOINT, { params });
        return response.data;
    }
    static async getById(id_cotacao, token) {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await api.get(`${API_ENDPOINT}/${id_cotacao}`, config);
        return response.data;
    }
    static async getTaxClassifications(token) {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await api.get(`${API_ENDPOINT}/cf/classificacoes-fiscais`, config);
        return response.data;
    }
    static async getShipmentTypes(token) {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await api.get(`${API_ENDPOINT}/tf/tipos-frete`, config);
        return response.data;
    }
    static async getPaymentConditions(token) {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await api.get(`${API_ENDPOINT}/cp/condicoes-pagamento`, config);
        return response.data;
    }
    static async create(data, token) {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await api.post(API_ENDPOINT, data, config);
        return response.data;
    }
    static async update(id_cotacao, data, token) {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await api.put(`${API_ENDPOINT}/${id_cotacao}`, data, config);
        return response.data;
    }
    static async delete(id_cotacao, token) {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await api.delete(`${API_ENDPOINT}/${id_cotacao}`, config);
        return response.data;
    }
}
export default QuoteService;
