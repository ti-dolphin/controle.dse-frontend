import api from "../../api"
import { PatrimonyAccessory } from "../../models/patrimonios/Accessory"

export class PatrimonyAccessoryService {
  static async getManyById(id_patrimonio: number): Promise<PatrimonyAccessory[]> {
    const response = await api.get<PatrimonyAccessory[]>(`/acessorio_patrimonio/${id_patrimonio}`)
    return response.data
  }

  static async create(payload: { nome: string; descricao?: string; id_patrimonio: number }): Promise<PatrimonyAccessory> {
    const response = await api.post<PatrimonyAccessory>(`/acessorio_patrimonio`, payload)
    return response.data
  }

  static async delete(id_acessorio_patrimonio: number): Promise<void> {
    await api.delete(`/acessorio_patrimonio/${id_acessorio_patrimonio}`)
  }

  static async getById(id_acessorio_patrimonio: number): Promise<PatrimonyAccessory> {
    const response = await api.get<PatrimonyAccessory>(`/acessorio_patrimonio/${id_acessorio_patrimonio}`)
    return response.data
  }
}

