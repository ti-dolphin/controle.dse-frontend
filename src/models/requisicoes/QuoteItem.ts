import { Product } from "../Product";

export interface QuoteItem {
  id_item_cotacao: number;
  id_cotacao: number;
  descricao_item: string;
  preco_unitario: string;
  quantidade_solicitada: number;
  subtotal: string;
  id_item_requisicao: number;
  observacao: string | null;
  ICMS: number;
  IPI: number;
  ST: number;
  quantidade_cotada: number;
  id_produto: number | null;
  produto?: Product;
  produto_descricao?: string;
  produto_codigo?: string;
  produto_unidade?: string;
}
