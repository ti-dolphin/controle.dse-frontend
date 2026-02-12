import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "../../../models/Note";

export interface NotesFilters {
  CODAPONT: number | null;
  CHAPA: string;
  NOME_FUNCIONARIO: string;
  NOME_FUNCAO: string;
  NOME_CENTRO_CUSTO: string;
  DESCRICAO_STATUS: string;
  NOME_LIDER: string;
  NOME_GERENTE: string;
  COMPETENCIA: number | null;
  CODSITUACAO: string;
  DATA_DE: string;
  DATA_ATE: string;
  ATIVOS: boolean;
  COMENTADOS: boolean;
  SEM_ASSIDUIDADE: boolean;
}

interface NotesTableState {
  rows: Note[];
  loading: boolean;
  error: string | null;
  selectedRow: Note | null;
  searchTerm: string;
  filters: NotesFilters;
  page: number;
  pageSize: number;
  totalRows: number;
}

const initialState: NotesTableState = {
  rows: [],
  loading: false,
  error: null,
  selectedRow: null,
  searchTerm: "",
  filters: {
    CODAPONT: null,
    CHAPA: "",
    NOME_FUNCIONARIO: "",
    NOME_FUNCAO: "",
    NOME_CENTRO_CUSTO: "",
    DESCRICAO_STATUS: "",
    NOME_LIDER: "",
    NOME_GERENTE: "",
    COMPETENCIA: null,
    CODSITUACAO: "",
    DATA_DE: "",
    DATA_ATE: "",
    ATIVOS: true,
    COMENTADOS: false,
    SEM_ASSIDUIDADE: false,
  },
  page: 0,
  pageSize: 50,
  totalRows: 0,
};

const notesTableSlice = createSlice({
  name: "notesTable",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Note[]>) {
      state.rows = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSelectedRow(state, action: PayloadAction<Note | null>) {
      state.selectedRow = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setFilters(state, action: PayloadAction<NotesFilters>) {
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
        NOME_FUNCAO: "",
        NOME_CENTRO_CUSTO: "",
        DESCRICAO_STATUS: "",
        NOME_LIDER: "",
        NOME_GERENTE: "",
        COMPETENCIA: null,
        CODSITUACAO: "",
        DATA_DE: "",
        DATA_ATE: "",
        ATIVOS: true,
        COMENTADOS: false,
        SEM_ASSIDUIDADE: false,
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
} = notesTableSlice.actions;

export default notesTableSlice.reducer;
