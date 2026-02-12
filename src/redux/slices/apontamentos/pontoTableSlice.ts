import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ponto } from "../../../models/Ponto";

export interface PontoFilters {
  CODAPONT: number | null;
  CHAPA: string;
  NOME_FUNCIONARIO: string;
  CODSTATUSAPONT: string;
  DESCRICAO_STATUS: string;
  CODCCUSTO: string;
  CODLIDER: number | null;
  COMPETENCIA: number | null;
  DATA_DE: string;
  DATA_ATE: string;
  VERIFICADO: string;
  PROBLEMA: boolean;
  AJUSTADO: boolean;
  ATIVOS: boolean;
  MOTIVO_PROBLEMA: string;
}

interface PontoTableState {
  rows: Ponto[];
  loading: boolean;
  error: string | null;
  selectedRow: Ponto | null;
  searchTerm: string;
  filters: PontoFilters;
  page: number;
  pageSize: number;
  totalRows: number;
}

const initialState: PontoTableState = {
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
    CODLIDER: null,
    COMPETENCIA: null,
    DATA_DE: "",
    DATA_ATE: "",
    VERIFICADO: "",
    PROBLEMA: false,
    AJUSTADO: false,
    ATIVOS: true,
    MOTIVO_PROBLEMA: "",
  },
  page: 0,
  pageSize: 50,
  totalRows: 0,
};

const pontoTableSlice = createSlice({
  name: "pontoTable",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Ponto[]>) {
      state.rows = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSelectedRow(state, action: PayloadAction<Ponto | null>) {
      state.selectedRow = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setFilters(state, action: PayloadAction<PontoFilters>) {
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
        CODLIDER: null,
        COMPETENCIA: null,
        DATA_DE: "",
        DATA_ATE: "",
        VERIFICADO: "",
        PROBLEMA: false,
        AJUSTADO: false,
        ATIVOS: true,
        MOTIVO_PROBLEMA: "",
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
} = pontoTableSlice.actions;

export default pontoTableSlice.reducer;
