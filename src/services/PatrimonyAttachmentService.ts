import api from '../api';

export interface PatrimonyAttachment {
  id_anexo_patrimonio: number;
  id_patrimonio: number;
  nome_arquivo: string;
  arquivo: string;
  criado_em: string;
  criado_por?: {
    NOME: string;
  };
}

export interface CreatePatrimonyAttachmentPayload {
  id_patrimonio: number;
  nome_arquivo: string;
  arquivo: string;
}

class PatrimonyAttachmentService {
  static async create(payload: CreatePatrimonyAttachmentPayload): Promise<PatrimonyAttachment> {
    const response = await api.post('/anexos-patrimonio', payload);
    return response.data;
  }

  static async getMany(id_patrimonio: number): Promise<PatrimonyAttachment[]> {
    const response = await api.get(`/anexos-patrimonio/patrimonio/${id_patrimonio}`);
    return response.data;
  }

  static async getById(id_anexo_patrimonio: number): Promise<PatrimonyAttachment> {
    const response = await api.get(`/anexos-patrimonio/${id_anexo_patrimonio}`);
    return response.data;
  }

  static async delete(id_anexo_patrimonio: number): Promise<void> {
    await api.delete(`/anexos-patrimonio/${id_anexo_patrimonio}`);
  }
}

export default PatrimonyAttachmentService;
