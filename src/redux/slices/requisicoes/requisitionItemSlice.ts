import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quote } from "../../../models/requisicoes/Quote";

interface RequisitionItemState {
  addingProducts: boolean;
  updatingRecentProductsQuantity: boolean;
  recentProductsAdded: number[];
  productsAdded: number[];
  replacingItemProduct: boolean;
  itemBeingReplaced: number | null;
  productSelected: number | null;
  newItems: number[];
  refresh: boolean;
  currentQuoteIdSelected: number | null;
  selectedQuote: Partial<Quote> | null;
  updatingChildReqItems: boolean;
  viewingItemAttachment: number | null;
}
const initialState: RequisitionItemState = {
  addingProducts: false,
  updatingRecentProductsQuantity: false,
  recentProductsAdded: [],
  productsAdded: [],
  replacingItemProduct: false,
  itemBeingReplaced: null,
  productSelected: null,
  newItems: [],
  refresh: false,
  currentQuoteIdSelected: null,
  selectedQuote: null,
  updatingChildReqItems: false,
  viewingItemAttachment: null,
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
    setCurrentQuoteIdSelected(state, action: PayloadAction<number | null>) {
      state.currentQuoteIdSelected = action.payload;
    },
    setSelectedQuote(state, action: PayloadAction<Partial<Quote> | null>) {
      state.selectedQuote = action.payload;
    },
    setUpdatingChildReqItems(state, action: PayloadAction<boolean>) {
      state.updatingChildReqItems = action.payload;
    },
    setViewingItemAttachment(state, action: PayloadAction<number | null>) {
      state.viewingItemAttachment = action.payload;
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
  setRefresh,
  setCurrentQuoteIdSelected,
  setSelectedQuote,
  setUpdatingChildReqItems,
  setViewingItemAttachment,
} = requisitionItemSlice.actions;

export default requisitionItemSlice.reducer;

