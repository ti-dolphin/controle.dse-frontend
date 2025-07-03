import { ReducedUser } from "../User";
import { RequisitionStatusTransition } from "./RequisitionStatusTransition";

export interface RequisitionStatusAlteration {
    id_alteracao: number;
    id_status_requisicao: number;
    alterado_por: number;
    data_alteracao: string;
    id_requisicao: number;
    justificativa: string;
    id_status_anterior: number;
    pessoa_alterado_por? : ReducedUser;
    transicao?: RequisitionStatusTransition
}
