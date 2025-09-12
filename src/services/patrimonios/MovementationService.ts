import api from "../../api";
import { Checklist } from "../../models/patrimonios/Checklist";
import { Movimentation } from "../../models/patrimonios/Movementation";



const API_ENDPOINT = "/movimentacao_patrimonio";
class MovementationService {
  static async create(data: any) {
    const response = await api.post<{mov: Movimentation, checklist: Partial<Checklist>}>(API_ENDPOINT, data);
    return response.data;
  }

  static async getMany(params: any) {
    const response = await api.get(API_ENDPOINT, { params });
    return response.data;
  }

  static async getById(id_movimentacao: number) {
    const response = await api.get(`${API_ENDPOINT}/${id_movimentacao}`);
    return response.data;
  }

  static async update(id_movimentacao: number, data: any) {
    const response = await api.put(`${API_ENDPOINT}/${id_movimentacao}`, data);
    return response.data;
  }

  static async delete(id_movimentacao: number) {
    const response = await api.delete(`${API_ENDPOINT}/${id_movimentacao}`);
    return response.data;
  }
}

export default MovementationService;
