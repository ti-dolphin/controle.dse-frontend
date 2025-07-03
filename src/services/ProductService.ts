import api from '../api';
import { Product } from '../models/Product';

const API_ENDPOINT = '/produtos';

export const ProductService = {
    async getMany(params?: any): Promise<Product[]> {
        const response = await api.get<Product[]>(API_ENDPOINT, { params });
        return response.data;
    },

    async getById(id: number): Promise<Product> {
        const response = await api.get<Product>(`${API_ENDPOINT}/${id}`);
        return response.data;
    },

    async create(product: Omit<Product, 'ID'>): Promise<Product> {
        const response = await api.post<Product>(API_ENDPOINT, product);
        return response.data;
    },

    async update(id: number, product: Partial<Product>): Promise<Product> {
        const response = await api.put<Product>(`${API_ENDPOINT}/${id}`, product);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`${API_ENDPOINT}/${id}`);
    }
};
