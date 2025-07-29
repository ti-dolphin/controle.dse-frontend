//useOppDetailedFields
import { FieldConfig } from "../../types";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Opportunity } from "../../models/oportunidades/Opportunity";
import { useProjectOptions } from "../projectOptionsHook";
import useOppStatusOptions from "./useOppStatusOptions";
import { useClientOptions } from "./useClientOptions";
import { useComercialResponsableOptions } from "./useComercialResponsableOptions";
import { User } from "../../models/User";

export const useOppDetailedFields = (user: User | null, opportunity: Partial<Opportunity>) => {

    const {projectOptions} = useProjectOptions();
    const {oppStatusOptions} = useOppStatusOptions();
    const {clientOptions} = useClientOptions();
    const {comercialResponsableOptions} = useComercialResponsableOptions();
    const [fieldsMap, setFieldsMap] = useState<Map<string, FieldConfig[]>>(new Map());
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
            defaultValue: "",
          
          },
          {
            field: "ID_PROJETO",
            label: "Projeto",
            type: "autocomplete",
            required: true,
            options: projectOptions,
            disabled: false,
            defaultValue: "",
         
          },
          {
            field: "FK_CODCLIENTE",
            label: "Cliente",
            type: "autocomplete",
            disabled: false,
            required: true,
            options: clientOptions,
            defaultValue: "",
         
          },
          {
            field: "CODSTATUS",
            label: "Status",
            type: "autocomplete",
            disabled: false,
            required: true,
            options: oppStatusOptions,
            defaultValue: "",
          
          },
          {
            field: "DATASOLICITACAO",
            label: "Data de Solicitação",
            type: "date",
            disabled: false,
            required: true,
            defaultValue: "",
          },
          {
            field: "DATAINICIO",
            label: "Data de Início",
            type: "date",
            disabled: false,
            required: true,
            defaultValue: "",
          },
          {
            field: "DATAENTREGA",
            label: "Data de Fechamento",
            type: "date",
            disabled: false,
            required: true,
            defaultValue: "",
          },
          { 
            field: "DATAINTERACAO",
            label: "Data de Interação",
            type: "date",
            disabled: false,
            required: true,
            defaultValue: "",
          },
          {
            field: "RESPONSAVEL",
            label: "Vendedor",
            type: "autocomplete",
            disabled: false,
            required: true,
            defaultValue: "",
            options: comercialResponsableOptions,
           
          },
          {
            field: "VALORFATDOLPHIN",
            label: "Valor Faturamento Dolphin",
            type: "number",
            disabled: false,
            required: false,
            defaultValue: "",
          },
          {
            field: "VALORFATDIRETO",
            label: "Valor Faturamento Direto",
            type: "number",
            disabled: false,
            required: false,
            defaultValue: "",
          },
          {
            field: "VALOR_COMISSAO",
            label: "Comissão",
            type: "number",
            disabled: false,
            required: false,
            defaultValue: "",
          },
        ]);
      }
   }, [projectOptions, oppStatusOptions, clientOptions, comercialResponsableOptions, opportunity]);

    useEffect(( ) => {
        const registerKeys = ['NOME', 'ID_PROJETO', 'FK_CODCLIENTE', 'CODSTATUS'];
        const registerFields = fields.filter((field) => registerKeys.includes(field.field));
        const dateKeys = ['DATASOLICITACAO', 'DATAINICIO', 'DATAENTREGA', "DATAINTERACAO"];
        const dateFields = fields.filter((field) => dateKeys.includes(field.field));
        const saleKeys = ['RESPONSAVEL', 'VALORFATDOLPHIN', 'VALORFATDIRETO', 'VALOR_COMISSAO'];
        const saleFields = fields.filter((field) => saleKeys.includes(field.field));
        setFieldsMap(new Map([['cadastro', registerFields], ['datas', dateFields], ['venda', saleFields]]));

    }, [fields]);
    
    return { fields, fieldsMap };
};