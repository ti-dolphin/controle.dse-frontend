import api from '../api';
import { AccessoryAttachment, CreateAccessoryAttachmentPayload } from '../models/patrimonios/AccessoryAttachment';

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
