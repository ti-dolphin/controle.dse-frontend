import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Checklist } from "../../../models/patrimonios/Checklist";

export interface ChecklistFilters {
  id_checklist_movimentacao: number | null;
  patrimonio_nome: string | null;
  responsavel_nome: string | null;
  realizado: boolean | null;
  aprovado: boolean | null;
  data_realizado: string | null;
  data_aprovado: string | null;
}

export interface ChecklistTableState {
  rows: Partial<Checklist>[];
  filters: ChecklistFilters;
  searchTerm: string;
  refresh: boolean;
}

const initialState: ChecklistTableState = {
  rows: [],
  filters: {
    id_checklist_movimentacao: null,
    patrimonio_nome: null,
    responsavel_nome: null,
    realizado: null,
    aprovado: null,
    data_realizado: null,
    data_aprovado: null,
  },
  searchTerm: "",
  refresh: false,
};

const checklistTableSlice = createSlice({
  name: "checklistTable",
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<Partial<Checklist>[]>) => {
      state.rows = action.payload;
      state.refresh = false;
    },
    updateSingleRow: (state, action: PayloadAction<Partial<Checklist>>) => {
      const index = state.rows.findIndex(
        (row) => row.id_checklist_movimentacao === action.payload.id_checklist_movimentacao
      );
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    addChecklist: (state, action: PayloadAction<Partial<Checklist>>) => {
      state.rows.push(action.payload);
      state.refresh = false;
    },
    setFilters: (state, action: PayloadAction<ChecklistFilters>) => {
      state.filters = action.payload;
      state.refresh = true;
    },
    cleanFilters: (state) => {
      state.filters = initialState.filters;
      state.refresh = true;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.refresh = true;
    },
    setRefresh: (state, action: PayloadAction<boolean>) => {
      state.refresh = action.payload;
    },
  },
});

export const {
  setRows,
  updateSingleRow,
  addChecklist,
  cleanFilters,
  setFilters,
  setSearchTerm,
  setRefresh,
} = checklistTableSlice.actions;
export default checklistTableSlice.reducer;

