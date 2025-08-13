import { createSlice } from "@reduxjs/toolkit";
const initialState = {
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
        setRows: (state, action) => {
            state.rows = action.payload;
            state.refresh = false;
        },
        updateSingleRow: (state, action) => {
            const index = state.rows.findIndex((row) => row.id_checklist_movimentacao === action.payload.id_checklist_movimentacao);
            if (index !== -1) {
                state.rows[index] = action.payload;
            }
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
            state.refresh = true;
        },
        cleanFilters: (state) => {
            state.filters = initialState.filters;
            state.refresh = true;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.refresh = true;
        },
        setRefresh: (state, action) => {
            state.refresh = action.payload;
        },
    },
});
export const { setRows, updateSingleRow, cleanFilters, setFilters, setSearchTerm, setRefresh } = checklistTableSlice.actions;
export default checklistTableSlice.reducer;
