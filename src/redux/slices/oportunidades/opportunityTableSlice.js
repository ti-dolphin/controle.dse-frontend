import { createSlice } from "@reduxjs/toolkit";
const initialState = {
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
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setRows(state, action) {
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
        setFilters(state, action) {
            state.filters = action.payload;
        },
    },
});
export const { setSearchTerm, setLoading, setRows, setFilters, clearfilters } = opportunityTableSlice.actions;
export default opportunityTableSlice.reducer;
