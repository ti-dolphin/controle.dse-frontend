
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
    gerente: ReducedUser;
    }