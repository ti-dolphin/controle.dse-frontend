import { ReducedUser } from "../User";

export interface OpportunityAttachment {
    id_anexo_os: number;
    codos: number;
    nome_arquivo: string;
    arquivo: string;
    criado_por? : ReducedUser;
    criado_em: string;
}