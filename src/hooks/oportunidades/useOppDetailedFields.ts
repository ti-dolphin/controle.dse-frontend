//useOppDetailedFields
import { FieldConfig } from "../../types";
import { useEffect, useState } from "react";
import { Opportunity } from "../../models/oportunidades/Opportunity";
import { useProjectOptions } from "../projectOptionsHook";
import useOppStatusOptions from "./useOppStatusOptions";
import { useClientOptions } from "./useClientOptions";
import { useComercialResponsableOptions } from "./useComercialResponsableOptions";
import { User } from "../../models/User";

export const useOppDetailedFields = (user: User | null, opportunity: Partial<Opportunity>) => {
  const { projectOptions } = useProjectOptions();
  const { oppStatusOptions } = useOppStatusOptions();
  const { clientOptions } = useClientOptions();
  const { comercialResponsableOptions } = useComercialResponsableOptions();
  const [fieldsMap, setFieldsMap] = useState<Map<string, FieldConfig[]>>(
    new Map()
  );
  const [fields, setFields] = useState<FieldConfig[]>([]);

  useEffect(() => {
    //verify if the dependencies has length
    if (
      projectOptions.length > 0 &&
      oppStatusOptions.length > 0 &&
      clientOptions.length > 0 &&
      comercialResponsableOptions.length > 0 &&
      opportunity
    ) {
      setFields([
        {
          field: "NOME",
          label: "Descrição",
          type: "text",
          required: true,
          disabled: false,
          defaultValue: opportunity.NOME ?? "",
        },
        {
          field: "ID_PROJETO",
          label: "Projeto",
          type: "autocomplete",
          required: true,
          options: projectOptions,
          disabled: false,
          defaultValue: opportunity.ID_PROJETO != null ? String(opportunity.ID_PROJETO) : "",
        },
        {
          field: "FK_CODCLIENTE",
          label: "Cliente",
          type: "autocomplete",
          disabled: false,
          required: true,
          options: clientOptions,
          defaultValue: opportunity.FK_CODCLIENTE != null ? String(opportunity.FK_CODCLIENTE) : "",
        },
        {
          field: "CODSTATUS",
          label: "Status",
          type: "autocomplete",
          disabled: false,
          required: true,
          options: oppStatusOptions,
          defaultValue: opportunity.CODSTATUS != null ? String(opportunity.CODSTATUS) : "",
        },
        {
          field: "DATASOLICITACAO",
          label: "Data de Solicitação",
          type: "date",
          disabled: false,
          required: true,
          defaultValue: opportunity.DATASOLICITACAO ?? "",
        },
        {
          field: "DATAINICIO",
          label: "Data de Início",
          type: "date",
          disabled: false,
          required: true,
          defaultValue: opportunity.DATAINICIO ?? "",
        },
        {
          field: "DATAENTREGA",
          label: "Data de Fechamento",
          type: "date",
          disabled: false,
          required: true,
          defaultValue: opportunity.DATAENTREGA ?? "",
        },
        {
          field: "DATAINTERACAO",
          label: "Data de Interação",
          type: "date",
          disabled: false,
          required: true,
          defaultValue: opportunity.DATAINTERACAO ?? "",
        },
        {
          field: "RESPONSAVEL",
          label: "Vendedor",
          type: "autocomplete",
          disabled: false,
          required: true,
          defaultValue: opportunity.RESPONSAVEL != null ? String(opportunity.RESPONSAVEL) : "",
          options: comercialResponsableOptions,
        },
        {
          field: "VALORFATDOLPHIN",
          label: "Valor Faturamento Dolphin",
          type: "number",
          disabled: false,
          required: false,
          defaultValue: opportunity.VALORFATDOLPHIN != null ? String(opportunity.VALORFATDOLPHIN) : "",
        },
        {
          field: "VALORFATDIRETO",
          label: "Valor Faturamento Direto",
          type: "number",
          disabled: false,
          required: false,
          defaultValue: opportunity.VALORFATDIRETO != null ? String(opportunity.VALORFATDIRETO) : "",
        },
        {
          field: "VALOR_COMISSAO",
          label: "Comissão",
          type: "number",
          disabled: false,
          required: false,
          defaultValue: opportunity.VALOR_COMISSAO != null ? String(opportunity.VALOR_COMISSAO) : "",
        },
      ]);
    }
  }, [
    projectOptions,
    oppStatusOptions,
    clientOptions,
    comercialResponsableOptions,
    opportunity,
  ]);

  useEffect(() => {
    const registerKeys = ["NOME", "ID_PROJETO", "FK_CODCLIENTE", "CODSTATUS"];
    const registerFields = fields.filter((field) =>
      registerKeys.includes(field.field)
    );
    const dateKeys = [
      "DATASOLICITACAO",
      "DATAINICIO",
      "DATAENTREGA",
      "DATAINTERACAO",
    ];
    // AQUI JÁ NÃO EXISTE MAIS AS DATAS
    const dateFields = fields.filter((field) => dateKeys.includes(field.field));
    const saleKeys = [
      "RESPONSAVEL",
      "VALORFATDOLPHIN",
      "VALORFATDIRETO",
      "VALOR_COMISSAO",
    ];
    const saleFields = fields.filter((field) => saleKeys.includes(field.field));
    setFieldsMap(
      new Map([
        ["cadastro", registerFields],
        ["datas", dateFields],
        ["venda", saleFields],
      ])
    );
  }, [fields]);

  return { fields, fieldsMap };
};