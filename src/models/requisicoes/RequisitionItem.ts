import { Product } from "../Product";

export interface RequisitionItem {
    id_item_requisicao: number;
    quantidade: number;
    id_requisicao: number;
    id_produto: number;
    observacao: string | null;
    ativo: number;
    oc: string | null;
    data_entrega: string | null;
    produto?: Product
    produto_descricao?: string;
    produto_codigo?: string;
    produto_unidade?: string;
    produto_quantidade_estoque?: number;
}
