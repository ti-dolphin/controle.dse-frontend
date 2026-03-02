import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommonFilters {
  searchTerm: string;
  DATA_DE: string;
  DATA_ATE: string;
  ATIVOS: boolean;
}

interface CommonFiltersState {
  filters: CommonFilters;
}

const initialState: CommonFiltersState = {
  filters: {
    searchTerm: "",
    DATA_DE: "",
    DATA_ATE: "",
    ATIVOS: true,
  },
};

const commonFiltersSlice = createSlice({
  name: "commonFilters",
  initialState,
  reducers: {
    setCommonFilters(state, action: PayloadAction<CommonFilters>) {
      state.filters = action.payload;
    },
    setCommonSearchTerm(state, action: PayloadAction<string>) {
      state.filters.searchTerm = action.payload;
    },
    setCommonDateFrom(state, action: PayloadAction<string>) {
      state.filters.DATA_DE = action.payload;
    },
    setCommonDateTo(state, action: PayloadAction<string>) {
      state.filters.DATA_ATE = action.payload;
    },
    setCommonAtivos(state, action: PayloadAction<boolean>) {
      state.filters.ATIVOS = action.payload;
    },
    clearCommonFilters(state) {
      state.filters = {
        searchTerm: "",
        DATA_DE: "",
        DATA_ATE: "",
        ATIVOS: true,
      };
    },
  },
});

export const {
  setCommonFilters,
  setCommonSearchTerm,
  setCommonDateFrom,
  setCommonDateTo,
  setCommonAtivos,
  clearCommonFilters,
} = commonFiltersSlice.actions;

export default commonFiltersSlice.reducer;
