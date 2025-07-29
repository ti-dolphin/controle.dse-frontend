import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Opportunity } from "../../../models/oportunidades/Opportunity";

export interface OpportunityTableState {
  searchTerm: string;
  loading: boolean;
  rows: Opportunity[];
}

const initialState: OpportunityTableState = {
  searchTerm: "",
  loading: false,
  rows: [],
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
  },
});

export const {
  setSearchTerm,
  setLoading,
  setRows,
} = opportunityTableSlice.actions;
export default opportunityTableSlice.reducer;
