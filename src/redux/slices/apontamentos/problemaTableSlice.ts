import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Problema } from "../../../models/Problema";

export interface ProblemaFilters {
  CODAPONT: number | null;
  CHAPA: string;
  NOME_FUNCIONARIO: string;
  CODSTATUSAPONT: string;
  DESCRICAO_STATUS: string;
  CODCCUSTO: string;
  NOME_CENTRO_CUSTO: string;
  NOME_GERENTE: string;
  NOME_LIDER: string;
  COMPETENCIA: number | null;
  DATA_DE: string;
  DATA_ATE: string;
  ATIVOS: boolean;
  COMENTADO: boolean;
  MOTIVO_PROBLEMA: string;
  JUSTIFICATIVA: string;
}

interface ProblemaTableState {
  rows: Problema[];
  loading: boolean;
  error: string | null;
  selectedRow: Problema | null;
  searchTerm: string;
  filters: ProblemaFilters;
  page: number;
  pageSize: number;
  totalRows: number;
}

const initialState: ProblemaTableState = {
  rows: [],
  loading: false,
  error: null,
  selectedRow: null,
  searchTerm: "",
  filters: {
    CODAPONT: null,
    CHAPA: "",
    NOME_FUNCIONARIO: "",
    CODSTATUSAPONT: "",
    DESCRICAO_STATUS: "",
    CODCCUSTO: "",
    NOME_CENTRO_CUSTO: "",
    NOME_GERENTE: "",
    NOME_LIDER: "",
    COMPETENCIA: null,
    DATA_DE: "",
    DATA_ATE: "",
    ATIVOS: true,
    COMENTADO: false,
    MOTIVO_PROBLEMA: "",
    JUSTIFICATIVA: "",
  },
  page: 0,
  pageSize: 50,
  totalRows: 0,
};

const problemaTableSlice = createSlice({
  name: "problemaTable",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Problema[]>) {
      state.rows = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSelectedRow(state, action: PayloadAction<Problema | null>) {
      state.selectedRow = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setFilters(state, action: PayloadAction<ProblemaFilters>) {
      state.filters = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setTotalRows(state, action: PayloadAction<number>) {
      state.totalRows = action.payload;
    },
    clearFilters(state) {
      state.filters = {
        CODAPONT: null,
        CHAPA: "",
        NOME_FUNCIONARIO: "",
        CODSTATUSAPONT: "",
        DESCRICAO_STATUS: "",
        CODCCUSTO: "",
        NOME_CENTRO_CUSTO: "",
        NOME_GERENTE: "",
        NOME_LIDER: "",
        COMPETENCIA: null,
        DATA_DE: "",
        DATA_ATE: "",
        ATIVOS: true,
        COMENTADO: false,
        MOTIVO_PROBLEMA: "",
        JUSTIFICATIVA: "",
      };
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
  setSearchTerm,
  clearFilters,
  setFilters,
  setPage,
  setPageSize,
  setTotalRows,
} = problemaTableSlice.actions;

export default problemaTableSlice.reducer;
