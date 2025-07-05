import { ReducedUser } from "../User";
import { PaymentCondition } from "./PaymentCondition";
import { TaxClassification } from "./TaxClassification";

export interface Quote {
    id_cotacao: number;
    id_requisicao: number;
    fornecedor: string;
    data_cotacao: string;
    observacao: string | null;
    descricao: string;
    cnpj_faturamento: string;
    valor_frete: string;
    id_tipo_frete: number;
    id_classificacao_fiscal: number;
    cnpj_fornecedor: string;
    criado_por: number | null;
    id_condicao_pagamento: number;
    pessoa_criado_por? : ReducedUser;
    condicao_pagamento? : PaymentCondition;
    classificacao_fiscal? : TaxClassification;
}
