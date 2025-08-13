import { useEffect, useState } from "react";
export const useOpportunityMandatoryFields = (projectOptions, oppStatusOptions, clientOptions, comercialResponsableOptions) => {
    const [fields, setFields] = useState([]);
    useEffect(() => {
        const opportunity = {}; // Placeholder for opportunity object
        const isAdicional = false; // Placeholder for isAdicional
        const fieldsConfig = [
            {
                label: "Descrição",
                field: "NOME",
                type: "text",
                disabled: false,
                defaultValue: "",
                required: true,
                value: opportunity ? opportunity.NOME : "",
            },
            {
                label: "Projeto",
                field: "ID_PROJETO",
                type: "autocomplete",
                disabled: isAdicional,
                required: isAdicional,
                defaultValue: "",
                value: opportunity
                    ? projectOptions.find((option) => option.id === opportunity.ID_PROJETO)
                    : "",
                options: projectOptions,
            },
            {
                label: "Status",
                field: "CODSTATUS",
                type: "autocomplete",
                disabled: false,
                defaultValue: "",
                required: true,
                value: opportunity
                    ? oppStatusOptions.find((option) => option.id === opportunity.CODSTATUS)
                    : "",
                options: oppStatusOptions,
            },
            {
                label: "Responsável Comercial",
                field: "RESPONSAVEL",
                type: "autocomplete",
                disabled: isAdicional,
                required: true,
                defaultValue: "",
                value: opportunity
                    ? comercialResponsableOptions.find((option) => option.id === opportunity.RESPONSAVEL)
                    : "",
                options: comercialResponsableOptions,
            },
            {
                label: "Cliente",
                field: "FK_CODCLIENTE",
                type: "autocomplete",
                disabled: false,
                required: true,
                defaultValue: "",
                value: opportunity
                    ? clientOptions.find((option) => option.id === opportunity.FK_CODCLIENTE)
                    : "",
                options: clientOptions,
            },
            {
                label: "Data de Solicitação",
                field: "DATASOLICITACAO",
                type: "date",
                disabled: false,
                defaultValue: "",
                value: opportunity ? opportunity.DATASOLICITACAO : "",
            },
            {
                label: "Data de fechamento",
                field: "DATAENTREGA",
                type: "date",
                disabled: false,
                defaultValue: "",
                value: opportunity ? opportunity.DATAENTREGA : "",
            },
            {
                label: "Data de Início",
                field: "DATAINICIO",
                type: "date",
                disabled: false,
                defaultValue: "",
                value: opportunity ? opportunity.DATAINICIO : "",
            },
        ];
        setFields(fieldsConfig);
    }, [projectOptions, oppStatusOptions, clientOptions, comercialResponsableOptions]);
    return { fields };
};
