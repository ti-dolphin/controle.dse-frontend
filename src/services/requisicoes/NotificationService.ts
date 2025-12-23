import api from "../../api";

export interface Notification {
  id_aviso: number;
  id_requisicao: number;
  id_usuario_destinatario: number;
  id_usuario_remetente: number;
  id_status_anterior: number;
  id_status_novo: number;
  nome_transicao: string | null;
  visto: boolean;
  data_criacao: string;
  data_visto: string | null;
  requisicao?: {
    ID_REQUISICAO: number;
    DESCRICAO: string;
  };
  remetente?: {
    CODPESSOA: number;
    nome: string;
  };
  status_anterior?: {
    id_status_requisicao: number;
    nome: string;
  };
  status_novo?: {
    id_status_requisicao: number;
    nome: string;
  };
}

const API_ENDPOINT = "/notifications";

export default class NotificationService {
  static async getUnseen(userId: number): Promise<Notification[]> {
    const response = await api.get(`${API_ENDPOINT}/${userId}`);
    return response.data;
  }

  static async getUnseenCount(userId: number): Promise<number> {
    const response = await api.get(`${API_ENDPOINT}/${userId}/count`);
    return response.data.count;
  }

  static async markAsSeen(id_aviso: number): Promise<void> {
    await api.patch(`${API_ENDPOINT}/${id_aviso}/seen`);
  }

  static async markAllAsSeen(userId: number): Promise<void> {
    await api.patch(`${API_ENDPOINT}/${userId}/seen-all`);
  }
}
