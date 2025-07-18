import { Project } from "../Project";
import { ReducedUser } from "../User";
import { RequisitionStatus } from "./RequisitionStatus";
import { RequisitionType } from "./RequisitionType";


export interface Requisition {
  ID_REQUISICAO: number; //preenchido automáticamente, não aparece no form
  DESCRIPTION: string; //campo texto, aparece no form
  ID_PROJETO: number; //autocomplete, aparece no form
  ID_RESPONSAVEL: number; //preenchido automáticamente (user.CODPESSOA), aparece no form
  TIPO: number; //autocomplete, aparece no form

  data_alteracao: string; //preenchido automáticamente, não aparece no form

  data_criacao: string; //preenchido automaticamente (new Date()), não aparece no form

  id_status_requisicao: number; //autoComplete, não aparece no form

  custo_total_frete : number;

  custo_total_itens : number;

  custo_total : number;

  OBSERVACAO: string | null;

  tipo_requisicao?: RequisitionType;
  projeto?: Project;
  gerente?: ReducedUser;
  responsavel?: ReducedUser;
  status?: RequisitionStatus;
  criado_por?: ReducedUser;
  alterado_por?: ReducedUser;
}

