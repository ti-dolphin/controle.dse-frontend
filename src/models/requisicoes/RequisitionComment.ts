
import { ReducedUser } from "../User";
import { Requisition } from "./Requisition";

export interface RequisitionComment {
  id_comentario_requisicao: number;
  id_requisicao: number;
  data_criacao: string;
  data_alteracao: string;
  descricao: string;

  criado_por?: ReducedUser;
  requisicao?: Requisition;
  pessoa_criado_por?: ReducedUser;
  
}