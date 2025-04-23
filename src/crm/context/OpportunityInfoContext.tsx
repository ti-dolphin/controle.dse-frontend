/* eslint-disable react-refresh/only-export-components */
import React, { createContext, Dispatch, SetStateAction, useState } from "react";
import { Opportunity } from "../types";// Tipagem para o filtro de datas
import { defaultOpportunity } from "../utils";

// Tipagem para o contexto de OpportunityInfo
interface OpportunityInfoContextType {
  filteredRows: Opportunity[]; // Linhas filtradas
  columnFilters: { dataKey: string; filterValue: string }[]; // Filtros aplicados nas colunas
  dateFilters: any[]; // Filtros de datas
  opp : Opportunity; // Oportunidade selecionada
  setOpp: React.Dispatch<React.SetStateAction<Opportunity>>;
  creatingOpportunity: boolean; // Estado para criar oportunidades
  currentOppIdSelected: number;
  refreshOpportunityInfo: boolean; // Estado para forçar atualização
  refreshOpportunityModal: boolean; // Estado para forçar atualização do modal
  setRefreshOpportunityModal: Dispatch<SetStateAction<boolean>>; // Função para forçar atualização do modal
  finishedOppsEnabled: boolean;
  setCurrentOppIdSelected: React.Dispatch<React.SetStateAction<number>>;
  setFinishedOppsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCreatingOpportunity: () => void; // Função para alternar criação de oportunidade
  setCreatingOpportunity: Dispatch<SetStateAction<boolean>>; // Função para
  toggleRefreshOpportunityModal: () => void; // Função para alternar atualização do modal
  toggleRefreshOpportunityInfo: () => void; // Função para alternar atualização
  changeFilteredRows: (rows: Opportunity[]) => void; // Atualizar linhas filtradas
  changeColumnFilters: (
    filters: { dataKey: string; filterValue: string }[]
  ) => void; // Atualizar filtros
  setDateFilters: React.Dispatch<React.SetStateAction<any[]>>; // Atualizar filtros de data
}

// Estado inicial para os filtros de coluna
const defaultColumnFilters = [
  { dataKey: "numero_projeto", filterValue: "" },
  { dataKey: "numero_adicional", filterValue: "" },
  { dataKey: "status", filterValue: "" },
  { dataKey: "descricao_projeto", filterValue: "" },
  { dataKey: "cliente", filterValue: "" },
  { dataKey: "data_cadastro", filterValue: "" },
  { dataKey: "data_solicitacao", filterValue: "" },
  { dataKey: "data_envio_proposta", filterValue: "" },
  { dataKey: "data_fechamento", filterValue: "" },
  { dataKey: "vendedor", filterValue: "" },
  { dataKey: "gerente", filterValue: "" },
  { dataKey: "coordenador", filterValue: "" },
];

// Estado inicial para os filtros de datas

export const defaultDateFilters = [
  { dateFilterKey: "data_inicio", from: "", to: "", dbField: "DATAINICIO" },
  {
    dateFilterKey: "data_interacao",
    from: "",
    to: "",
    dbField: "DATAINTERACAO",
  },
  {
    dateFilterKey: "data_fechamento",
    from: "",
    to: "",
    dbField: "DATAENTREGA",
  },
];

interface OpportunityInfoProviderProps {
  children: React.ReactNode;
}

// Criação do contexto
export const OpportunityInfoContext = createContext<OpportunityInfoContextType>({
  filteredRows: [],
  columnFilters: defaultColumnFilters,
  dateFilters: defaultDateFilters,
  finishedOppsEnabled: false,
  creatingOpportunity: false,
  refreshOpportunityInfo: false,
  refreshOpportunityModal: false,
  setRefreshOpportunityModal: () => {},
  currentOppIdSelected: 0,
  setCurrentOppIdSelected: () => {},
  opp: {
    CODOS: 0,
    CODTIPOOS: 0,
    CODCCUSTO: "",
    OBRA: "",
    DATASOLICITACAO: new Date(),
    DATANECESSIDADE: null,
    DOCREFERENCIA: null,
    LISTAMATERIAIS: null,
    DATAINICIO: new Date(),
    DATAPREVENTREGA: new Date(),
    DATAENTREGA: new Date(),
    CODSTATUS: 0,
    NOME: "",
    DESCRICAO: "",
    ATIVIDADES: null,
    PRIORIDADE: 0,
    SOLICITANTE: 0,
    RESPONSAVEL: 0,
    CODDISCIPLINA: 0,
    GUT: 0,
    GRAVIDADE: 0,
    URGENCIA: 0,
    TENDENCIA: 0,
    DATALIBERACAO: null,
    RELACIONAMENTO: 0,
    FK_CODCLIENTE: 0,
    FK_CODCOLIGADA: 0,
    VALORFATDIRETO: 0,
    VALORSERVICOMO: 0,
    VALORSERVICOMATAPLICADO: 0,
    VALORMATERIAL: 0,
    VALORTOTAL: 0,
    CODSEGMENTO: 0,
    CODCIDADE: 0,
    VALORLOCACAO: null,
    ID_ADICIONAL: 0,
    ID_PROJETO: 0,
    DATAINTERACAO: new Date(),
    VALORFATDOLPHIN: 0,
    PRINCIPAL: false,
    VALOR_COMISSAO: 0,
    id_motivo_perdido: 0,
    observacoes: null,
    DESCRICAO_VENDA: null,
    EMAIL_VENDA_ENVIADO: false,
    status: {
      CODSTATUS: 0,
      NOME: "",
      ACAO: 0,
      ATIVO: false,
    },
    adicional: {
      ID: 0,
      NUMERO: 0,
      ID_PROJETO: 0,
    },
    cliente: {
      CODCOLIGADA: 0,
      CODCLIENTE: "",
      NOMEFANTASIA: "",
    },
    projeto: {
      ID: 0,
      DESCRICAO: "",
      CODGERENTE: 0,
      ATIVO: 0,
      gerente: {
        CODGERENTE: 0,
        NOME: "",
      },
    },
    responsavel: {
      CODPESSOA: 0,
      NOME: "",
    },
    web_anexos_os: [],
  },
  setOpp: () => {},
  setFinishedOppsEnabled: () => {},
  toggleCreatingOpportunity: () => {},
  toggleRefreshOpportunityModal: () => {},
  toggleRefreshOpportunityInfo: () => {},
  changeFilteredRows: () => {},
  changeColumnFilters: () => {},
  setCreatingOpportunity: () => {},
  setDateFilters: () => {},
});

// Implementação do Provider
export const OpportunityInfoProvider = ({
  children,
}: OpportunityInfoProviderProps) => {

  const [opp, setOpp] = useState<Opportunity>(defaultOpportunity);
  const [filteredRows, setFilteredRows] = useState<Opportunity[]>([]);
  const [columnFilters, setColumnFilters] = useState(defaultColumnFilters);
  const [dateFilters, setDateFilters] =
    useState<any[]>(defaultDateFilters);
  const [creatingOpportunity, setCreatingOpportunity] = useState(false);
  const [refreshOpportunityInfo, setRefreshOpportunityInfo] = useState(false);
  const [finishedOppsEnabled, setFinishedOppsEnabled] = useState(false);
  const [currentOppIdSelected, setCurrentOppIdSelected] = useState(0);
  const [refreshOpportunityModal, setRefreshOpportunityModal] =
    useState(false);
  const toggleCreatingOpportunity = () => {
    console.log("toggleCreatingOpportunity: ", !creatingOpportunity);
    setCreatingOpportunity((prev) => !prev);
  };

  const toggleRefreshOpportunityModal = () => {
    setRefreshOpportunityModal((prev) => !prev);
  };

  const toggleRefreshOpportunityInfo = () => {
    setRefreshOpportunityInfo((prev) => !prev);
  };

  const changeFilteredRows = (rows: Opportunity[]) => {
    setFilteredRows(rows);
  };

  const changeColumnFilters = (
    filters: { dataKey: string; filterValue: string }[]
  ) => {
    setColumnFilters(filters);
  };

  return (
    <OpportunityInfoContext.Provider
      value={{
        filteredRows,
        columnFilters,
        dateFilters,
        setDateFilters,
        creatingOpportunity,
        refreshOpportunityInfo,
        toggleCreatingOpportunity,
        toggleRefreshOpportunityInfo,
        toggleRefreshOpportunityModal,
        refreshOpportunityModal,
        setRefreshOpportunityModal,
        changeFilteredRows,
        changeColumnFilters,
        finishedOppsEnabled,
        currentOppIdSelected ,
        opp,
        setOpp,
        setCurrentOppIdSelected,
        setCreatingOpportunity,
        setFinishedOppsEnabled,
      }}
    >
      {children}
    </OpportunityInfoContext.Provider>
  );
};
