
import { Option } from "../../types";

export const useQuoteFields = (
isSupplierRoute :boolean,
  taxClassificationOptions: Option[],
  paymentConditionOptions: Option[],
  shipmentTypeOptions: Option[],
) => {


  const fields: Array<{
    name: string;
    label: string;
    autoComplete?: boolean;
    select?: boolean;
    disabled?: boolean;
    required?: boolean;
    type?: string;
    options: Option[];
  }> = [
    {
      name: "fornecedor",
      label: "Fornecedor",
      autoComplete: false,
      disabled: isSupplierRoute,
      required: true,
      options: [],
    },
    {
      name: "valor_frete",
      label: "Valor Frete",
      type: "number",
      autoComplete: false,
      options: [],
    },
    {
      name: "id_tipo_frete",
      label: "Tipo Frete",
      autoComplete: true,
      disabled: isSupplierRoute,
      options: shipmentTypeOptions,
    },
    {
      name: "id_classificacao_fiscal",
      label: "Classificação fiscal",
      autoComplete: true,
      disabled: isSupplierRoute,
      options: taxClassificationOptions,
    },
    {
      name: "id_condicao_pagamento",
      label: "Condição Pagamento",
      autoComplete: true,
      disabled: false,
      required: isSupplierRoute,
      options: paymentConditionOptions,
    },
    {
      name: "cnpj_fornecedor",
      label: "CNPJ Fornecedor",
      autoComplete: false,
      required: isSupplierRoute,
      options: [],
    },
    {
      name: "entrega",
      label: "Entrega",
      select: true,
      required: isSupplierRoute,
      options: [
        { id: "Pronta entrega", name: "Pronta entrega" },
        { id: "dois dias úteis", name: "2 dias úteis" },
        { id: "cinco dias úteis", name: "5 dias úteis" },
        { id: "7", name: "7 dias úteis" },
        { id: "10", name: "10 dias úteis" },
        { id: "15", name: "15 dias úteis" },
        { id: "30", name: "30 dias úteis" },
      ],
    },
    {
      name: "cnpj_faturamento",
      label: "CNPJ Faturamento",
      autoComplete: false,
      disabled: isSupplierRoute,
      options: [],
    },
  ];

  const disabledFields = isSupplierRoute
    ? {
        id_requisicao: true,
        fornecedor: true,
        data_cotacao: true,
        id_tipo_frete: true,
        id_classificacao_fiscal: true,
        id_condicao_pagamento: false,
        valor_frete: true,
        observacao: true,
        descricao: true,
        cnpj_faturamento: true,
      }
    : {
        cnpj_fornecedor: isSupplierRoute,
      };

  return {fields, disabledFields}
};
