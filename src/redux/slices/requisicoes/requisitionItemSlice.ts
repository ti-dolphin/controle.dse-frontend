import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RequisitionItemState {
  addingProducts: boolean;
  updatingRecentProductsQuantity: boolean;
  recentProductsAdded: number[];
  productsAdded: number[];
  replacingItemProduct: boolean;
  itemBeingReplaced: number | null;
  productSelected: number | null;
  newItems : number[],
  refresh : boolean
}

const initialState: RequisitionItemState = {
  addingProducts: false,
  updatingRecentProductsQuantity: false,
  recentProductsAdded: [],
  productsAdded : [],
  replacingItemProduct : false,
  itemBeingReplaced: null,
  productSelected: null,
  refresh : false,
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

    setRefresh(state, action: PayloadAction<boolean>) {
      state.refresh = action.payload;
    },
    setReplacingItemProduct(state, action: PayloadAction<boolean>) {
      state.replacingItemProduct = action.payload;
    },

    setProductSelected(state, action: PayloadAction<number | null>) {
      state.productSelected = action.payload;
    },

    setItemBeingReplaced(state, action: PayloadAction<number | null>) {
      state.itemBeingReplaced = action.payload;
    },
    setRecentAddedProducts(state, action: PayloadAction<number[]>) {
      state.recentProductsAdded = action.payload;
    },
    setProductsAdded(state, action: PayloadAction<number[]>) {
      state.productsAdded = action.payload;
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
  clearNewItems,
  setProductsAdded,
  setReplacingItemProduct,
  setItemBeingReplaced,
  setProductSelected,
  setRefresh
} = requisitionItemSlice.actions;

export default requisitionItemSlice.reducer;
