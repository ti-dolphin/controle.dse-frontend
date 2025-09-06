import api from "../api";


const API_ENDPOINT = '/anexos_produto';

class ProductAttachmentService {

  static async getByProduct(id_produto: number) {
    const response = await api.get(`${API_ENDPOINT}/${id_produto}`);
    return response.data;
  }

  static async create(data: {
    arquivo: string,
    id_produto: number,
  }) {
    const response = await api.post(API_ENDPOINT, data);
    return response.data;
  }

  static async delete(id_anexo_produto: number) {
    const response = await api.delete(`${API_ENDPOINT}/${id_anexo_produto}`);
    return response.data;
  }
}

export default ProductAttachmentService;
