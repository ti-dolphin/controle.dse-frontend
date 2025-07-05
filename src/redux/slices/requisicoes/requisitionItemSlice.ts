import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RequisitionItemState {
  addingProducts: boolean;
  updatingRecentProductsQuantity: boolean;
  recentProductsAdded: number[];
  newItems : number[]
}

const initialState: RequisitionItemState = {
  addingProducts: false,
  updatingRecentProductsQuantity: false,
  recentProductsAdded: [],
  newItems : []
};

const requisitionItemSlice = createSlice({
  name: "requisitionItem",
  initialState,
  reducers: {
    setAddingProducts(state, action: PayloadAction<boolean>) {
      state.addingProducts = action.payload;
    },
    setUpdatingRecentProductsQuantity(state, action: PayloadAction<boolean>) {
      state.updatingRecentProductsQuantity = action.payload;
    },
    setNewItems(state, action: PayloadAction<number[]>) {
      state.newItems = action.payload;
    },
    setRecentAddedProducts(state, action: PayloadAction<number[]>) {
      state.recentProductsAdded = action.payload;
    },
    removeRecentProduct(state, action: PayloadAction<number>) {
      state.recentProductsAdded = state.recentProductsAdded.filter(
        (id) => id !== action.payload
      );
    },
    clearRecentProducts(state) {
      state.recentProductsAdded = [];
    },
    clearNewItems(state) {
      state.newItems = [];
    },
  },
});

export const {
  setAddingProducts,
  setUpdatingRecentProductsQuantity,
  setRecentAddedProducts,
  removeRecentProduct,
  clearRecentProducts,
  setNewItems,
  clearNewItems
} = requisitionItemSlice.actions;

export default requisitionItemSlice.reducer;
