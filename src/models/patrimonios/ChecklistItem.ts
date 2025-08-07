

import { Checklist } from "./Checklist"
import { Movimentation } from "./Movementation"

export interface ChecklistItem { 
    id_item_checklist_movimentacao: number
    id_checklist_movimentacao: number
    nome_item_checklist: string
    arquivo: string
    problema: boolean
    valido: boolean
    observacao: string
    checklist? : Partial<Checklist>
}