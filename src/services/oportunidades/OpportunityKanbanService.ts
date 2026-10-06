import api from "../../api";
import { ArchivedOpportunity, KanbanCardOpportunity, OpportunityKanbanColumn } from "../../models/oportunidades/OpportunityKanbanColumn";
import { KanbanBoardName } from "../../utils/kanbanFlowRules";

const API_ENDPOINT = "/kanban_oportunidades";

export interface OpportunityKanbanMovement {
  id: string;
  CODOS: number;
  quadro: KanbanBoardName;
  coluna_origem_id: number | null;
  coluna_origem_nome: string | null;
  coluna_destino_id: number;
  coluna_destino_nome: string;
  CODPESSOA: number | null;
  usuario_nome: string | null;
  origem: "manual" | "automatica" | "restauracao";
  movimentado_em: string;
}

export interface OpportunityKanbanNotification {
  id: string;
  visto: boolean;
  data_criacao: string;
  movimento: Pick<OpportunityKanbanMovement, "CODOS" | "quadro" | "coluna_origem_nome" | "coluna_destino_nome" | "origem" | "CODPESSOA" | "usuario_nome">;
  oportunidade: {
    CODOS: number;
    NOME: string;
    projeto: { ID: number } | null;
    adicional: { NUMERO: number } | null;
  };
}

const OpportunityKanbanService = {
  getCards: async (board: KanbanBoardName, todos?: boolean): Promise<KanbanCardOpportunity[]> => {
    const response = await api.get(`${API_ENDPOINT}/cards`, { params: { board, todos } });
    return response.data;
  },
  getColumns: async (board: KanbanBoardName): Promise<OpportunityKanbanColumn[]> => {
    const response = await api.get(API_ENDPOINT, { params: { board } });
    return response.data;
  },
  updateCardColumn: async (CODOS: number, board: KanbanBoardName, kanban_column_id: number) => {
    const response = await api.put(`${API_ENDPOINT}/${CODOS}`, { board, kanban_column_id });
    return response.data;
  },
  unarchiveCard: async (CODOS: number, board: KanbanBoardName, kanban_column_id: number) => {
    const response = await api.put(`${API_ENDPOINT}/${CODOS}/desarquivar`, { board, kanban_column_id });
    return response.data;
  },
  createColumn: async (name: string, board: KanbanBoardName): Promise<OpportunityKanbanColumn> => {
    const response = await api.post(API_ENDPOINT, { name, board });
    return response.data;
  },
  deleteColumn: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINT}/${id}`);
  },
  renameColumn: async (id: number, name: string): Promise<OpportunityKanbanColumn> => {
    const response = await api.put(`${API_ENDPOINT}/colunas/${id}`, { name });
    return response.data;
  },
  getArchivedCards: async (board: KanbanBoardName): Promise<ArchivedOpportunity[]> => {
    const response = await api.get(`${API_ENDPOINT}/arquivados`, { params: { board } })
    return response.data
  },
  getMovementHistory: async (CODOS: number, board: KanbanBoardName): Promise<OpportunityKanbanMovement[]> => {
    const response = await api.get(`${API_ENDPOINT}/${CODOS}/movimentos`, { params: { board } })
    return response.data
  },
  getMovementNotifications: async (): Promise<OpportunityKanbanNotification[]> => {
    const response = await api.get(`${API_ENDPOINT}/notificacoes`)
    return response.data
  },
  markMovementNotificationSeen: async (id: string): Promise<void> => {
    await api.patch(`${API_ENDPOINT}/notificacoes/${id}/visualizada`)
  },
  markAllMovementNotificationsSeen: async (): Promise<void> => {
    await api.patch(`${API_ENDPOINT}/notificacoes/visualizadas`)
  },
};

export default OpportunityKanbanService;
