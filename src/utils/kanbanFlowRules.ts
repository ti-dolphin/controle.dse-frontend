export type KanbanBoardName = "Comercial" | "Orçamento";

export const BOARD_FIELD: Record<KanbanBoardName, "kanban_column_id" | "kanban_column_id_orcamento"> = {
  Comercial: "kanban_column_id",
  "Orçamento": "kanban_column_id_orcamento",
};

// Valor do campo `board` em web_kanban_crm_columns pras colunas compartilhadas
// (Bloqueado/Arquivado/Excluído) — aparecem nos dois quadros.
export const SHARED_BOARD_VALUE = "Todos";

export const BLOCKED_COLUMN_ID = 17;
export const ARCHIVED_COLUMN_ID = 18;
export const DELETED_COLUMN_ID = 19;

// Colunas que só podem ser preenchidas pelo sistema — nunca destino de arraste manual.
export const AUTO_ONLY_COLUMN_IDS = [3]; // Comercial.Proposta

export function isManualMoveAllowed(
  columnId: number,
  board: KanbanBoardName,
  fromColumnId: number,
  canCheckCrm = false
): { allowed: true } | { allowed: false; message: string } {
  if (columnId === BLOCKED_COLUMN_ID || columnId === ARCHIVED_COLUMN_ID || columnId === DELETED_COLUMN_ID) {
    return { allowed: true };
  }

  if (AUTO_ONLY_COLUMN_IDS.includes(columnId)) {
    return { allowed: false, message: "Essa coluna só é preenchida automaticamente pelo fluxo." };
  }

  const administrative = [BLOCKED_COLUMN_ID, ARCHIVED_COLUMN_ID, DELETED_COLUMN_ID];
  if (board === "Orçamento" && fromColumnId !== columnId) {
    if (columnId === 16) {
      return { allowed: false, message: 'Proposta enviada só pode ser definida pelo quadro Comercial.' };
    }
    if (columnId === 15 && fromColumnId !== 14) {
      return { allowed: false, message: 'Somente Checagem pode avançar para Liberado.' };
    }
    if (columnId === 15 && !canCheckCrm) {
      return { allowed: false, message: 'Você não tem permissão para liberar a checagem do CRM.' };
    }
    const allowed: Record<number, number[]> = { 10: [12, 11], 12: [10, 13, 11], 13: [12, 14, 11], 14: [13, 15, 11], 15: [14, 11], 16: [11], 11: [12, 13, 14] };
    if (!administrative.includes(fromColumnId) && !allowed[fromColumnId]?.includes(columnId)) {
      return { allowed: false, message: 'Movimento não permitido pelo fluxo de Orçamento.' };
    }
  }
  if (board === "Comercial" && fromColumnId !== columnId && !administrative.includes(fromColumnId)) {
    const allowed: Record<number, number[]> = { 1: [2], 2: [1], 3: [], 4: [6], 5: [6], 6: [4, 5, 7, 8, 9], 7: [6], 8: [6], 9: [6] };
    if (!allowed[fromColumnId]?.includes(columnId)) {
      return {
        allowed: false,
        message: [2, 3].includes(fromColumnId)
          ? 'Aguarde a liberação pelo quadro de Orçamento para movimentar esta oportunidade no Comercial.'
          : 'Movimento não permitido pelo fluxo comercial.',
      };
    }
  }

  return { allowed: true };
}
