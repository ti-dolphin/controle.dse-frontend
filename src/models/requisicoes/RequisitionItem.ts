import { Product } from "../Product";
import { QuoteItem } from "./QuoteItem";
import { RequisitionItemAttachment } from "./RequisitionItemAttachment";

export interface RequisitionItem {
    id_item_requisicao: number;
    quantidade: number;
    id_requisicao: number;
    id_produto: number;
    observacao: string | null;
    ativo: number;
    oc: string | null;
    data_entrega: string | null;
    id_item_cotacao?: number;
    items_cotacao ? : Partial<QuoteItem[]>;

    anexos? : RequisitionItemAttachment[];
    produto?: Product
    produto_descricao?: string;
    produto_codigo?: string;
    produto_unidade?: string;
    produto_quantidade_estoque?: number;
}
