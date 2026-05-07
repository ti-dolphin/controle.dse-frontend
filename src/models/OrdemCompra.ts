export interface OrdemCompra {
  ID: number;
  COLIGADA: number | string;
  COD_CENTRO_CUSTO: string;
  CENTRO_CUSTO: string;
  NUMERO_MOVIMENTO: number | string;
  DATA_EMISSAO: string;
  DATA_ENTREGA: string | null;
  VALOR_BRUTO: number | string;
  FORNECEDOR: string;
  FORNECEDOR_NOME_FANTASIA: string;
}
