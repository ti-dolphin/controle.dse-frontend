import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Opportunity } from "../../../models/oportunidades/Opportunity";
import { OpportunityFilters } from "../../../hooks/oportunidades/useOpportunityFilters";

export interface OpportunityTableState {
  searchTerm: string;
  loading: boolean;
  rows: Opportunity[];
  filters: OpportunityFilters;
  totals: {
    total: number;
    totalFatDolphin: number;
    totalFatDireto: number;
  };
}
const defaultFilters = {
  CODOS: null,
  ID_PROJETO: null,
  NOME: "",
  cliente: "",
  projeto: "",
  status: "",
  responsavel: "",
  DATASOLICITACAO_FROM: null,
  DATASOLICITACAO_TO: null,
  DATAINICIO_FROM: null,
  DATAINICIO_TO: null,
  DATAINTERACAO_FROM: null,
  DATAINTERACAO_TO: null,
  DATAENTREGA_FROM: null,
  DATAENTREGA_TO: null,
  VALOR_TOTAL: null,
  adicional: null,
};
const initialState: OpportunityTableState = {
  searchTerm: "",
  loading: false,
  rows: [],
  filters: defaultFilters,
  totals: {
    total: 0,
    totalFatDolphin: 0,
    totalFatDireto: 0,
  },
};

const opportunityTableSlice = createSlice({
  name: "opportunityTable",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setRows(state, action: PayloadAction<Opportunity[]>) {
      state.rows = action.payload;
    },

    clearfilters(state) {
      state.filters = defaultFilters;
    },

    setFilters(state, action: PayloadAction<any>) {
      state.filters = action.payload;
    },
    setTotals(state, action: PayloadAction<any>) {
      state.totals = action.payload;
    },
  },
});

export const {
  setSearchTerm,
  setLoading,
  setRows,
  setFilters,
  clearfilters,
  setTotals,
} = opportunityTableSlice.actions;
export default opportunityTableSlice.reducer;
