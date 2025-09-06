import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../models/Product";

const initialState = {
  viewingProducts : false,
  viewingProductAttachment: null as number | null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setViewingProducts(state, action: PayloadAction<boolean>) {
      state.viewingProducts = action.payload
    },
    setViewingProductAttachment(state, action: PayloadAction<number | null>) {
      state.viewingProductAttachment = action.payload
    }
  },
});

export const { setViewingProducts, setViewingProductAttachment } = productSlice.actions;
export default productSlice.reducer;

export type ProductState = typeof initialState;

