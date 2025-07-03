import api from '../../api';
import { RequisitionType } from '../../models/requisicoes/RequisitionType';

const API_ENDPOINT = '/tipo_requisicao';



export class RequisitionTypeService {
    static async getMany(): Promise<RequisitionType[]> {
        const response = await api.get<RequisitionType[]>(API_ENDPOINT);
        return response.data;
    }

    static async getById(id: number): Promise<RequisitionType> {
        const response = await api.get<RequisitionType>(`${API_ENDPOINT}/${id}`);
        return response.data;
    }

    static async create(data: Omit<RequisitionType, 'id'>): Promise<RequisitionType> {
        const response = await api.post<RequisitionType>(API_ENDPOINT, data);
        return response.data;
    }

    static async update(id: number, data: Partial<Omit<RequisitionType, 'id'>>): Promise<RequisitionType> {
        const response = await api.put<RequisitionType>(`${API_ENDPOINT}/${id}`, data);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await api.delete(`${API_ENDPOINT}/${id}`);
    }
}