
import { ReducedUser } from "../User";

export interface RequisitionFile{ 
    id_requisicao: number;
    arquivo: string;
    nome_arquivo: string;
    id: number;
    criado_por : number;
    pessoa_criado_por?: ReducedUser;
    criado_em: string | null;
}