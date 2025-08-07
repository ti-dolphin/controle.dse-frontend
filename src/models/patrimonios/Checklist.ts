import { ReducedUser } from "../User";
import { ChecklistItem } from "./ChecklistItem";
import { Movimentation } from "./Movementation";
import { Patrimony } from "./Patrimony";

export interface Checklist {
  id_checklist_movimentacao: number;
  id_movimentacao: number;
  data_criacao: string;
  realizado?: number | boolean;
  data_realizado?: string;
  aprovado?: number | boolean;
  data_aprovado?: string;
  observacao?: string;
  reprovado?: number | boolean;
  movimentacao?: Partial<Movimentation>; // Replace 'any' with actual type if available
  patrimonio_nome?: string;
  responsavel : ReducedUser;
  responsavel_nome: string;
  patrimonio  : Partial<Patrimony>;

  items?: Partial<ChecklistItem>[]; // Replace 'any' with actual type if
}

