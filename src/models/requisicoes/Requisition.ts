import { Project } from "../Project";
import { ReducedUser } from "../User";
import { RequisitionStatus } from "./RequisitionStatus";
import { RequisitionType } from "./RequisitionType";


export interface Requisition {
  ID_REQUISICAO: number;
  DESCRIPTION: string; 
  ID_PROJETO: number; 
  ID_RESPONSAVEL: number; 
  TIPO: number; 
  id_requisicao_original: number;
  data_alteracao: string;

  data_criacao: string; 

  id_status_requisicao: number; 
  tipo_faturamento: number | null; 
  id_escopo_requisicao: number;

  custo_total_frete : number;
  custo_total_itens : number;
  custo_total : number;
  valor_aprovado_diretoria?: number;
  id_comprador?: number;

  tipo_requisicao?: RequisitionType;
  projeto?: Project;
  gerente?: ReducedUser;
  responsavel?: ReducedUser;
  responsavel_projeto?: ReducedUser;
  status?: RequisitionStatus;
  criado_por?: ReducedUser;
  alterado_por?: ReducedUser;
  comprador?: ReducedUser;
}

