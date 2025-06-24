//requisitionTableSlice

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Requisition } from "../../../models/requisicoes/Requisition";
import { RequisitionKanban } from "../../../models/requisicoes/RequisitionKanban";

interface RequisitionTableState {
    rows: Requisition[];
    loading: boolean;
    error: string | null;
    selectedRow: Requisition | null;
    kanbans : RequisitionKanban[];
    selectedKanban: RequisitionKanban | null;
}

const initialState: RequisitionTableState = {
    rows: [],
    loading: false,
    error: null,
    selectedRow: null,
    kanbans: [],
    selectedKanban: null,
};

const requisitionTableSlice = createSlice({
    name: "requisitionTable",
    initialState,
    reducers: {
        setRows(state, action: PayloadAction<Requisition[]>) {
            state.rows = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setSelectedRow(state, action: PayloadAction<Requisition | null>) {
            state.selectedRow = action.payload;
        },
        setKanbans(state, action: PayloadAction<RequisitionKanban[]>) {
            state.kanbans = action.payload;
        },
        setSelectedKanban(state, action: PayloadAction<RequisitionKanban | null>) {
            state.selectedKanban = action.payload;
        },
        clearRows(state) {
            state.rows = [];
            state.loading = false;
            state.error = null;
        },
    },
});

export const { setRows, setLoading, setError, clearRows, setSelectedRow, setKanbans, setSelectedKanban } = requisitionTableSlice.actions;
export default requisitionTableSlice.reducer;
