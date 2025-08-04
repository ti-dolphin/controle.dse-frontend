import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Opportunity } from "../../../models/oportunidades/Opportunity";

export interface OpportunityTableState {
  searchTerm: string;
  loading: boolean;
  rows: Opportunity[];
  filters: any;
}

const initialState: OpportunityTableState = {
  searchTerm: "",
  loading: false,
  rows: [],
  filters: {
    CODOS: null,
    ID_PROJETO: null,
    NOME: "",
    cliente: "",
    projeto: "",
    status: "",
    responsavel: "",
    DATASOLICITACAO: null,
    DATAINICIO: null,
    DATAENTREGA: null,
    VALOR_TOTAL: null,
    adicional: null,
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
      state.filters = {
        CODOS: null,
        ID_PROJETO: null,
        NOME: "",
        cliente: "",
        projeto: "",
        status: "",
        responsavel: "",
        DATASOLICITACAO: null,
        DATAINICIO: null,
        DATAENTREGA: null,
        VALOR_TOTAL: null,
        adicional: null,
      };
    },

    setFilters(state, action: PayloadAction<any>) {
      state.filters = action.payload;
    },
  },
});

export const { setSearchTerm, setLoading, setRows, setFilters, clearfilters } = opportunityTableSlice.actions;
export default opportunityTableSlice.reducer;
