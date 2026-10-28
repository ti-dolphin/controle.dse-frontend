import api from "../../api";
import { OpportunityAlinhamento } from "../../models/oportunidades/OpportunityAlinhamento";

const API_ENDPOINT = "/alinhamento_oportunidade";

export interface OpportunityAlinhamentoComment {
  id: number;
  id_alinhamento: number;
  comentario: string;
  criado_por: number;
  criado_em: string;
  criado_por_nome: string | null;
}

export class OpportunityAlinhamentoService {
  static async getMany(CODOS: number): Promise<OpportunityAlinhamento[]> {
    const response = await api.get(API_ENDPOINT, { params: { CODOS } });
    return response.data;
  }

  static async create(data: { CODOS: number; descricao: string; ordem?: number }): Promise<OpportunityAlinhamento> {
    const response = await api.post(API_ENDPOINT, data);
    return response.data;
  }

  static async update(id_alinhamento: number, data: Partial<OpportunityAlinhamento>): Promise<OpportunityAlinhamento> {
    const response = await api.put(`${API_ENDPOINT}/${id_alinhamento}`, data);
    return response.data;
  }

  static async delete(id_alinhamento: number): Promise<void> {
    await api.delete(`${API_ENDPOINT}/${id_alinhamento}`);
  }

  static async reordenar(itens: { id_alinhamento: number; ordem: number }[]): Promise<void> {
    await api.put(`${API_ENDPOINT}/reordenar`, { itens });
  }

  static async getManyComments(CODOS: number): Promise<OpportunityAlinhamentoComment[]> {
    const response = await api.get(`${API_ENDPOINT}/comentarios`, { params: { CODOS } });
    return response.data;
  }

  static async createComment(data: { id_alinhamento: number; comentario: string }): Promise<OpportunityAlinhamentoComment> {
    const response = await api.post(`${API_ENDPOINT}/comentarios`, data);
    return response.data;
  }

  static async deleteComment(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINT}/comentarios/${id}`);
  }
}
