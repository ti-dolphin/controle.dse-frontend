import api from '../../api';
import { Product } from '../../models/Product';
import { RequisitionItem } from '../../models/requisicoes/RequisitionItem';

const API_ENDPOINT = '/item_requisicao';

export class RequisitionItemService {
    static async getMany(params?: any): Promise<RequisitionItem[]> {
        const response = await api.get<RequisitionItem[]>(API_ENDPOINT, { params });
        return response.data;
    }

    static async getById(id: number): Promise<RequisitionItem> {
        const response = await api.get<RequisitionItem>(`${API_ENDPOINT}/${id}`);
        return response.data;
    }

    static async create(data: Omit<RequisitionItem, 'id_item_requisicao'>): Promise<RequisitionItem> {
        const response = await api.post<RequisitionItem>(API_ENDPOINT, data);
        return response.data;
    }

    static async createMany(productIds : number[], id_requisicao : number)  : Promise<number[]> {
        const response = await api.post(`${API_ENDPOINT}/many`, productIds, {
            params: { id_requisicao }
        });
        return response.data;
    }

    static async update(id: number, data: Partial<Omit<RequisitionItem, 'id_item_requisicao'>>): Promise<RequisitionItem> {
        const response = await api.put<RequisitionItem>(`${API_ENDPOINT}/${id}`, data);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await api.delete(`${API_ENDPOINT}/${id}`);
    }
}

export default RequisitionItemService;
