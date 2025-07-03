//RequisitionService
import api from "../../api";
import { ReducedUser } from "../../models/User";

const  API_ENDPOINT = '/requisicoes';

export default class RequisitionService {
    // Defina os métodos para interagir com a API de requisições
    static async getMany(user : ReducedUser | null, params?: any) {
        const response = await api.get(API_ENDPOINT, { 
            params: {user, params}
        });
        console.log("data: ", response.data)
        return response.data;
    }

    static async getById(id_requisicao: number) {
        const response = await api.get(`${API_ENDPOINT}/${id_requisicao}`);
        return response.data;
    }

    static async create(data: any) {
        const response = await api.post(API_ENDPOINT, data);
        return response.data;
    }

    static async update(id_requisicao: number, data: any) {
        const response = await api.put(`${API_ENDPOINT}/${id_requisicao}`, data);
        return response.data;
    }

    static async delete(id_requisicao: number) {
        const response = await api.delete(`${API_ENDPOINT}/${id_requisicao}`);
        return response.data;
    }
}
