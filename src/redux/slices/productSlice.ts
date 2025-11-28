import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../models/Product";

const initialState = {
  products: [] as Product[],
  viewingProducts : false,
  viewingProductAttachment: null as number | null,
  viewingStandardGuide: null as number | null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload
    },
    setViewingProducts(state, action: PayloadAction<boolean>) {
      state.viewingProducts = action.payload
    },
    setViewingProductAttachment(state, action: PayloadAction<number | null>) {
      state.viewingProductAttachment = action.payload
    },
    setViewingStandardGuide(state, action: PayloadAction<number | null>) {
      state.viewingStandardGuide = action.payload
    }
  },
});

export const { setProducts, setViewingProducts, setViewingProductAttachment, setViewingStandardGuide } = productSlice.actions;
export default productSlice.reducer;

export type ProductState = typeof initialState;

