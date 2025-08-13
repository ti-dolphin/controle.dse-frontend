export const useQuoteFields = (isSupplierRoute, taxClassificationOptions, paymentConditionOptions, shipmentTypeOptions) => {
    const fields = [
        {
            name: "fornecedor",
            label: "Fornecedor",
            autoComplete: false,
            disabled: isSupplierRoute,
            options: [],
        },
        {
            name: "descricao",
            label: "Descrição",
            autoComplete: false,
            disabled: isSupplierRoute,
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
            label: "ID Tipo Frete",
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
            label: "ID Condição Pagamento",
            autoComplete: true,
            disabled: isSupplierRoute,
            options: paymentConditionOptions,
        },
        {
            name: "cnpj_fornecedor",
            label: "CNPJ Fornecedor",
            autoComplete: false,
            options: [],
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
            id_condicao_pagamento: true,
            valor_frete: true,
            observacao: true,
            descricao: true,
            cnpj_faturamento: true,
        }
        : {
            cnpj_fornecedor: isSupplierRoute,
        };
    return { fields, disabledFields };
};
