//requisitionTableSlice
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
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
        responsavel: "",
        pessoa_alterado_por: "",
        pessoa_criado_por: "",
        projeto: "",
        gerente: "",
        status: "",
        tipo: "",
        custo_total: null,
        responsavel_projeto: "",
        // data_criacao: "",
    },
};
const requisitionTableSlice = createSlice({
    name: "requisitionTable",
    initialState,
    reducers: {
        setRows(state, action) {
            state.rows = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setSelectedRow(state, action) {
            state.selectedRow = action.payload;
        },
        setKanbans(state, action) {
            state.kanbans = action.payload;
        },
        setSelectedKanban(state, action) {
            state.selectedKanban = action.payload;
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        setFilters(state, action) {
            state.filters = action.payload;
        },
        clearfilters(state) {
            state.filters = {
                ID_REQUISICAO: null,
                DESCRIPTION: "",
                responsavel: "",
                pessoa_alterado_por: "",
                pessoa_criado_por: "",
                projeto: "",
                gerente: "",
                status: "",
                tipo: "",
                custo_total: null,
                responsavel_projeto: "",
                // data_criacao: "",
            };
        },
        clearRows(state) {
            state.rows = [];
            state.loading = false;
            state.error = null;
        },
    },
});
export const { setRows, setLoading, setError, clearRows, setSelectedRow, setKanbans, setSelectedKanban, setSearchTerm, clearfilters, setFilters, } = requisitionTableSlice.actions;
export default requisitionTableSlice.reducer;
