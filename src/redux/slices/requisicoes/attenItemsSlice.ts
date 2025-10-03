import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setError } from "./requisitionTableSlice";
import { RequisitionItem } from "../../../models/requisicoes/RequisitionItem";


export interface AttendItemsState {
  items: Partial<RequisitionItem>[] | [];
  attendingItems: boolean;
  loading: boolean;
  error: string | null;
  refresh: boolean;
  notAttendedItems: RequisitionItem[];
  itemsToAttend: RequisitionItem[]
}

const initialState: AttendItemsState = {
    items: [],
    loading: false,
    attendingItems: false,
    error: null,
    refresh: false,
    notAttendedItems: [],
    itemsToAttend: []
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
    startAttendingItems(state) {
      state.attendingItems = true;
    },

    setNotAttendedItems(state, action: PayloadAction<RequisitionItem[]>) {
      state.notAttendedItems = action.payload.map((item) => ({
        ...item,
        quantidade_atendida: 0,
      }));
    },

    setItemsToAttend(state, action: PayloadAction<RequisitionItem[]>){ 
      state.itemsToAttend = action.payload
    },
    stopAttendingItems(state) {
      state.attendingItems = false;
    },
  },
});


export const { setItems, setRefresh, startAttendingItems, stopAttendingItems, setNotAttendedItems, setItemsToAttend } = attendItemsSlice.actions;
export default attendItemsSlice.reducer;