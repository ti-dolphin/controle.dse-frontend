//RequisitionService
import api from "../../api";
import { Requisition } from "../../models/requisicoes/Requisition";
import { ReducedUser, User } from "../../models/User";
import { parseDate } from "../../utils";

const  API_ENDPOINT = '/requisicoes';

export default class RequisitionService {
    // Defina os métodos para interagir com a API de requisições
    static async getMany(user : ReducedUser | null, params?: any) {
        console.log('user', user)
        const response = await api.get(API_ENDPOINT, { 
            params: {user, params}
        });
        return response.data;
    }

    static async create(data: any) {
        const response = await api.post(API_ENDPOINT, data);
        return response.data;
    }

    static async update(id: number, data: any) {
        const response = await api.put(`${API_ENDPOINT}/${id}`, data);
        return response.data;
    }

    static async delete(id: number) {
        const response = await api.delete(`${API_ENDPOINT}/${id}`);
        return response.data;
    }
}
