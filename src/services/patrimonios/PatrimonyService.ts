import api from "../../api";
import { Patrimony } from "../../models/patrimonios/Patrimony";
import { PatrimonyType } from "../../models/patrimonios/PatrimonyType";

export class PatrimonyService {
  static async getMany(): Promise<Patrimony[]> {
    const response = await api.get<Patrimony[]>(`/patrimonios`);
    return response.data;
  }

  static async getById(id_patrimonio: number): Promise<Patrimony> {
    const response = await api.get<Patrimony>(`/patrimonios/${id_patrimonio}`);
    return response.data;
  }

  static async getTypes(): Promise<PatrimonyType[]> {
      const reponse = await api.get<PatrimonyType[]>(`/patrimonios/tipos/getAll`);
      return reponse.data;
  }

  static async update(id_patrimonio: number, data: Partial<Patrimony>) {
    const response = await api.put<Patrimony>(`/patrimonios/${id_patrimonio}`, data);
    return response.data;
  }

  static async create(data: any) {
    const response = await api.post<Patrimony>(`/patrimonios`, data);
    return response.data;
  }

  static async delete(id_patrimonio: number) {
    const response = await api.delete(`/patrimonios/${id_patrimonio}`);
    if(response.status === 204) return true;
    return false;
  }
}
