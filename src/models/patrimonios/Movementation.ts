
import { ReducedUser } from "../User";
import { Project } from "../Project";
import { Patrimony } from "./Patrimony";

export interface Movimentation {
  id_movimentacao: number;
  data: string;
  id_patrimonio: number;
  id_projeto: number;
  id_responsavel: number;
  id_ultima_movimentacao: number;
  observacao: string | null;
  aceito: number;
  responsavel: ReducedUser;
  projeto: Project;

  patrimonio: Patrimony;
  patrimonio_nserie: string;
  patrimonio_nome: string;
  patrimonio_descricao: string;
  patrimonio_nome_tipo: string;
  patrimonio_valor_compra: number;

  responsavel_nome: string;
  gerente_nome: string;
  projeto_descricao: string;
  ultima_movimentacao: Movimentation | null;
  ultima_movimentacao_data : string;
  gerente: ReducedUser;
}