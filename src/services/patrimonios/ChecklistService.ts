import api from '../../api';


const API_ENDPOINT = `/checklist`;

export class CheckListService {
  static async getById(id_checklist: number) {
    const response = await api.get(`${API_ENDPOINT}/${id_checklist}`);
    return response.data;
  }
  static async getMany(params: any) {
    const response = await api.get(API_ENDPOINT, { params });
    return response.data;
  }

  static async  verifyChecklistCreation(){ 
    const response = await api.get(`${API_ENDPOINT}/verificar/criacao`);
    return response.data;
  }

  static async verifyChecklistItems(){ 
    const response = await api.get(`${API_ENDPOINT}/verificar/itens`);
    return response.data;
  }

  static async verifyChecklistEmails(){ 
    const response = await api.get(`${API_ENDPOINT}/verificar/emails`);
    return response.data;
  }

  static async getManyByUser(codpessoa: number, params: any) {
    const response = await api.get(`${API_ENDPOINT}/${codpessoa}/by_usuario`, {
      params,
    });
    return response.data;
  }

  static async create() {}

  static async update(id_checklist_movimentacao: number, data: any) {
    const response = await api.put(
      `${API_ENDPOINT}/${id_checklist_movimentacao}`,
      data
    );
    return response.data;
  }

  static async delete() {}

  static async approve(id_checklist_movimentacao: number): Promise<void> {
    const response = await api.put(`${API_ENDPOINT}/${id_checklist_movimentacao}/approve`);
    return response.data;
  }
}