import { KanbanChecklistItem } from "./KanbanChecklistItem";

export interface KanbanChecklist {
  id_checklist: number;
  CODOS: number | null;
  id_seguidor_projeto: number | null;
  nome: string;
  ordem: number;
  itens: KanbanChecklistItem[];
}
