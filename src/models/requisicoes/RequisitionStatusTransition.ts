export interface RequisitionStatusTransition {
    id_transicao: number;
    id_status_anterior: number;
    id_status_requisicao: number;
    nome_transicao: string;
    ativo: boolean;
}
