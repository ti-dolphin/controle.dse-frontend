//
import api from "../../api";
const API_ENPOINT = "/item_cotacao";
export class QuoteItemService {
    static getMany = async (params, token) => {
        const config = {
            params,
            ...(token && { headers: { Authorization: token } }),
        };
        const response = await api.get(API_ENPOINT, config);
        return response.data;
    };
    static getById = async (id_item_cotacao, token) => {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await api.get(`${API_ENPOINT}/${id_item_cotacao}`, config);
        return response.data;
    };
    static create = async (data) => {
        const response = await api.post(API_ENPOINT, data);
        return response.data;
    };
    static update = async (id_item_cotacao, data, token) => {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await api.put(`${API_ENPOINT}/${id_item_cotacao}`, data, config);
        return response.data;
    };
    static delete = async (id_item_cotacao) => {
        const response = await api.delete(`${API_ENPOINT}/${id_item_cotacao}`);
        return response.data;
    };
}
