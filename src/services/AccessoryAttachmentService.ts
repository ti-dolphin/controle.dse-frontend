import api from '../api';

export interface AccessoryAttachment {
  id_anexo_acessorio_patrimonio: number;
  id_acessorio_patrimonio: number;
  nome: string;
  arquivo: string;
}

export interface CreateAccessoryAttachmentPayload {
  id_acessorio_patrimonio: number;
  nome: string;
  arquivo: string;
}

class AccessoryAttachmentService {
  static async create(payload: CreateAccessoryAttachmentPayload): Promise<AccessoryAttachment> {
    const response = await api.post('/anexo_acessorio_patrimonio', payload);
    return response.data;
  }

  static async getMany(id_acessorio_patrimonio: number): Promise<AccessoryAttachment[]> {
    const response = await api.get(`/anexo_acessorio_patrimonio/${id_acessorio_patrimonio}`);
    return response.data;
  }

  static async getById(id_anexo_acessorio_patrimonio: number): Promise<AccessoryAttachment> {
    const response = await api.get(`/anexo_acessorio_patrimonio/${id_anexo_acessorio_patrimonio}`);
    return response.data;
  }

  static async delete(id_anexo_acessorio_patrimonio: number): Promise<void> {
    await api.delete(`/anexo_acessorio_patrimonio/${id_anexo_acessorio_patrimonio}`);
  }
}

export default AccessoryAttachmentService;
