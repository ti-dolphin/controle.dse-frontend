import { ProductAttachment } from "./ProductAttachment";

export interface Product {
    ID: number;
    codigo: string;
    descricao: string;
    unidade: string;
    anexos? : ProductAttachment[];
    quantidade_estoque: number;
    quantidade_reservada: number;
    quantidade_disponivel: number;
    perm_ti?: number;
    perm_operacional?: number;
    perm_faturamento_direto?: number;
    perm_faturamento_dse?: number;
}
