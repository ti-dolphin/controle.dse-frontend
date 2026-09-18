import api from "../../api";
import { QuoteItemAttachment } from "../../models/requisicoes/QuoteItemAttachment";

const API_ENDPOINT = "/anexo_item_cotacao";

export class QuoteItemAttachmentService {
  static async getByQuoteItem(
    id_item_cotacao: number,
    tipo?: number,
    token?: string,
  ): Promise<QuoteItemAttachment[]> {
    const response = await api.get<QuoteItemAttachment[]>(
      `${API_ENDPOINT}/item/${id_item_cotacao}`,
      {
        params: { tipo },
        ...(token && { headers: { Authorization: token } }),
      },
    );
    return response.data;
  }

  static async create(
    attachment: Partial<QuoteItemAttachment>,
    token?: string,
  ): Promise<QuoteItemAttachment> {
    const config = token ? { headers: { Authorization: token } } : {};
    const response = await api.post<QuoteItemAttachment>(
      API_ENDPOINT,
      attachment,
      config,
    );
    return response.data;
  }

  static async delete(id: number, token?: string): Promise<void> {
    const config = token ? { headers: { Authorization: token } } : {};
    await api.delete(`${API_ENDPOINT}/${id}`, config);
  }
}
