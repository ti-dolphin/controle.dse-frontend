//requisitionTableSlice

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Requisition } from "../../../models/requisicoes/Requisition";
import { RequisitionKanban } from "../../../models/requisicoes/RequisitionKanban";

export const filterFieldMap: Record<string, string> = {
  ID_REQUISICAO: "ID_REQUISICAO.equals",
  DESCRIPTION: "DESCRIPTION.contains",
  OBSERVACAO: "OBSERVACAO.contains",
  responsavel: "pessoa_web_requisicao_ID_RESPONSAVELTopessoa.NOME.contains",
  alterado_por: "pessoa_web_requisicao_alterado_porTopessoa.NOME.contains",
  criado_por: "pessoa_web_requisicao_criado_porTopessoa.NOME.contains",
  projeto: "projetos.DESCRICAO.contains",
  gerente: "projetos.pessoa.NOME.contains",
  status: "web_status_requisicao.nome.contains",
  tipo: "web_tipo_requisicao.nome_tipo.contains",
  data_criacao: "data_criacao.equals",
};

export interface RequisitionFilters {
  ID_REQUISICAO: number | null;
  DESCRIPTION: string;
  OBSERVACAO: string;
  responsavel: string;
  pessoa_alterado_por: string;
  pessoa_criado_por: string;
  projeto: string;
  gerente: string;
  status: string;
  tipo: string;
  data_criacao: string;
}
export const buildPrismaFilters = (filters: RequisitionFilters) => {
  return Object.entries(filters)
    .filter(([field, value]) => {
      if (field === "data_criacao") {
        if (!value) return false;
        const date = new Date(value);
        if (isNaN(date.getTime())) return false;
        if (date.getFullYear() < 1900) return false;
      }
      return value !== "";
    }) //filtra todos os valores e valida a data
    
    .flatMap(([field, value]) => {
        //Monta o intervalo
      if (field === "data_criacao") {
        const date = new Date(value + "T00:00:00-03:00"); //cria data no fuso horário correto
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        return [
          { data_criacao: { gte: start.toISOString() } },
          { data_criacao: { lt: end.toISOString() } },
        ];
      }
      const path = filterFieldMap[field]; //data_criacao.equals
      if (!path) return [];
      let finalValue = value;
      return [
        path
          .split(".")
          .reverse()
          .reduce((acc, key, idx) => {
            if (idx === 0) return { [key]: finalValue };
            return { [key]: acc };
          }, {}),
      ];
    });
};

interface RequisitionTableState {
  rows: Requisition[];
  loading: boolean;
  error: string | null;
  selectedRow: Requisition | null;
  kanbans: RequisitionKanban[];
  selectedKanban: RequisitionKanban | null;
  searchTerm: string;
  filters: RequisitionFilters;
}

const initialState: RequisitionTableState = {
  rows: [],
  loading: false,
  error: null,
  selectedRow: null,
  kanbans: [],
  selectedKanban: null,
  searchTerm: "",
  filters: {
    ID_REQUISICAO: null,
    DESCRIPTION: "",
    OBSERVACAO: "",
    responsavel: "",
    pessoa_alterado_por: "",
    pessoa_criado_por: "",
    projeto: "",
    gerente: "",
    status: "",
    tipo: "",
    data_criacao: "",
  },
};

const requisitionTableSlice = createSlice({
  name: "requisitionTable",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Requisition[]>) {
      state.rows = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSelectedRow(state, action: PayloadAction<Requisition | null>) {
      state.selectedRow = action.payload;
    },
    setKanbans(state, action: PayloadAction<RequisitionKanban[]>) {
      state.kanbans = action.payload;
    },
    setSelectedKanban(state, action: PayloadAction<RequisitionKanban | null>) {
      state.selectedKanban = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setFilters(state, action: PayloadAction<RequisitionFilters>) {
      state.filters = action.payload;
    },
    clearRows(state) {
      state.rows = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setRows,
  setLoading,
  setError,
  clearRows,
  setSelectedRow,
  setKanbans,
  setSelectedKanban,
  setSearchTerm,
  setFilters,
} = requisitionTableSlice.actions;
export default requisitionTableSlice.reducer;
