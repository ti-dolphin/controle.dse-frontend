import api from '../api';
const API_ENDPOINT = '/produtos';
export const ProductService = {
    async getMany(params) {
        const response = await api.get(API_ENDPOINT, { params });
        return response.data;
    },
    async getById(id) {
        const response = await api.get(`${API_ENDPOINT}/${id}`);
        return response.data;
    },
    async create(product) {
        const response = await api.post(API_ENDPOINT, product);
        return response.data;
    },
    async update(id, product) {
        const response = await api.put(`${API_ENDPOINT}/${id}`, product);
        return response.data;
    },
    async delete(id) {
        await api.delete(`${API_ENDPOINT}/${id}`);
    }
};
