import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    requisition: {
        ID_REQUISICAO: 0,
        DESCRIPTION: "",
        ID_PROJETO: 0,
        ID_RESPONSAVEL: 0,
        TIPO: 0,
        data_alteracao: "",
        data_criacao: "",
        id_status_requisicao: 1,
        OBSERVACAO: null,
        custo_total_frete: 0,
        custo_total_itens: 0,
        custo_total: 0,
    },
    mode: "view", // inicia em visualização
    loading: false,
    error: null,
    refreshRequisition: false,
    creating: false
};
const requisitionFormSlice = createSlice({
    name: "requisitionForm",
    initialState,
    reducers: {
        setRequisition(state, action) {
            state.requisition = action.payload;
            state.mode = action.payload.ID_REQUISICAO ? "view" : "create";
        },
        updateRequisitionField(state, action) {
            state.requisition[action.payload.field] = action.payload.value;
        },
        setMode(state, action) {
            state.mode = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setCreating(state, action) {
            state.creating = action.payload;
        },
        setRefreshRequisition(state, action) {
            state.refreshRequisition = action.payload;
        },
        clearRequisition(state) {
            state.requisition = initialState.requisition;
            state.mode = "view";
            state.loading = false;
            state.error = null;
        },
    },
});
export const { setRequisition, updateRequisitionField, setMode, setLoading, setError, clearRequisition, setRefreshRequisition, setCreating } = requisitionFormSlice.actions;
export default requisitionFormSlice.reducer;
