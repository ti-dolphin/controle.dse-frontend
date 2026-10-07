import api from "../../api";
import { KanbanChecklistItem } from "../../models/oportunidades/KanbanChecklistItem";

const API_ENDPOINT = "/item_checklist_oportunidade";

export class KanbanChecklistItemService {
  static async create(data: { id_checklist: number; descricao: string }): Promise<KanbanChecklistItem> {
    const response = await api.post(API_ENDPOINT, data);
    return response.data;
  }

  static async update(id_item: number, data: Partial<KanbanChecklistItem>): Promise<KanbanChecklistItem> {
    const response = await api.put(`${API_ENDPOINT}/${id_item}`, data);
    return response.data;
  }

}
