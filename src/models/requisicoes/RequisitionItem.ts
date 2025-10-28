import { Product } from "../Product";
import { QuoteItem } from "./QuoteItem";
import { RequisitionItemAttachment } from "./RequisitionItemAttachment";

export interface RequisitionItem {
    id_item_requisicao: number;
    quantidade: number;
    target_price: number | null;
    id_requisicao: number;
    id_produto: number;
    observacao: string | null;
    ativo: number;
    oc: string | null;
    data_entrega: string | null;
    quantidade_disponivel: number;
    id_item_cotacao?: number;
    items_cotacao ? : Partial<QuoteItem[]>;
    quantidade_atendida?: number;
    anexos? : RequisitionItemAttachment[];
    produto?: Product
    produto_descricao?: string;
    produto_codigo?: string;
    produto_unidade?: string;
    produto_quantidade_estoque?: number;
    produto_quantidade_disponivel?: number;
}
