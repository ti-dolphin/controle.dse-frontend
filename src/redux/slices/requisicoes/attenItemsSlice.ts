import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setError } from "./requisitionTableSlice";
import { RequisitionItem } from "../../../models/requisicoes/RequisitionItem";


export interface AttendItemsState {
    items: Partial<RequisitionItem>[] | [];
    attendingItems : boolean;
    loading: boolean;
    error: string | null;
    refresh: boolean
}

const initialState: AttendItemsState = {
    items: [],
    loading: false,
    attendingItems: false,
    error: null,
    refresh: false
}

const attendItemsSlice = createSlice({
    name: "attendItems",
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<any[]>) => {
            console.log(action.payload);
            state.items = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setRefresh(state, action: PayloadAction<boolean>) {
            state.refresh = action.payload;
        },
        startAttendingItems (state) {
            state.attendingItems = true;
        },
        stopAttendingItems (state) {
            state.attendingItems = false;
        },
    },
});


export const { setItems, setRefresh, startAttendingItems, stopAttendingItems } = attendItemsSlice.actions;
export default attendItemsSlice.reducer;