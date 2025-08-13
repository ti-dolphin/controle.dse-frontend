import api from '../api';
const API_URL = '/users'; // ajuste conforme seu backend
export class UserService {
    static async getSupplierAcces(id_cotacao, id_requisicao) {
        const response = await api.get(`authorization/getSupplierAccess`, {
            params: {
                id_cotacao,
                id_requisicao
            }
        });
        return response.data;
    }
    static async getById(CODPESSOA) {
        const { data } = await api.get(`${API_URL}/${CODPESSOA}`);
        return data;
    }
    static async getMany(params) {
        const { data } = await api.get(API_URL, { params });
        return data;
    }
    static async getComercialUsers() {
        const { data } = await api.get(`${API_URL}/comercial/pessoa_comercial`);
        return data;
    }
    static async login({ LOGIN, SENHA }) {
        const { data } = await api.post(`${API_URL}/login`, { LOGIN, SENHA });
        return data;
    }
    static async create(payload) {
        const { data } = await api.post(API_URL, payload);
        return data;
    }
    static async update(CODPESSOA, payload) {
        const { data } = await api.put(`${API_URL}/${CODPESSOA}`, payload);
        return data;
    }
    static async delete(CODPESSOA) {
        const { data } = await api.delete(`${API_URL}/${CODPESSOA}`);
        return data;
    }
}
