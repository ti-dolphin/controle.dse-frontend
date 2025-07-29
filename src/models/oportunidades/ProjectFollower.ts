import { ReducedUser } from "../User";

export interface ProjectFollower {
    id_seguidor_projeto: number;
    id_projeto: number;
    codpessoa: number;
    ativo: boolean;
    pessoa: ReducedUser;
    pessoa_email? : string
}