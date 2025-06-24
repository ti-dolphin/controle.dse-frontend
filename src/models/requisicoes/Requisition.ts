import { Project } from "../Project";
import { ReducedUser } from "../User";
import { RequisitionStatus } from "./RequisitionStatus";
import { RequisitionType } from "./RequisitionType";


export interface Requisition {
  ID_REQUISICAO: number;
  DESCRIPTION: string;
  ID_PROJETO: number;
  ID_RESPONSAVEL: number;
  data_alteracao: string;
  data_criacao: string;
  id_status_requisicao: number;
  OBSERVACAO: string | null;
  alterado_por: number;
  TIPO: number;
  criado_por: number;
  tipo_requisicao?: RequisitionType;
  projeto?: Project;
  gerente?: ReducedUser;
  responsavel?: ReducedUser;
  status?: RequisitionStatus;
  pessoa_criado_por?: ReducedUser;
  pessoa_alterado_por?: ReducedUser;
}

