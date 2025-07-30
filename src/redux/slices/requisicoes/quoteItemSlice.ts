import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuoteItem } from "../../../models/requisicoes/QuoteItem";

export interface QuoteItemState {
  quoteItems: QuoteItem[];
  addingReqItems: boolean;
}

const initialState: QuoteItemState = {
  quoteItems: [],
  addingReqItems: false,
};

const quoteItemSlice = createSlice({
  name: "quoteItem",
  initialState,
  reducers: {
    setQuoteItems(state, action: PayloadAction<QuoteItem[]>) {
      state.quoteItems = action.payload;
    },

    setSingleQuoteItem(state, action: PayloadAction<QuoteItem>) {
      state.quoteItems = state.quoteItems.map((item) => {
        if (item.id_item_cotacao === action.payload.id_item_cotacao) {
          return action.payload;
        }
        return item;
      });
    },

    setAddingReqItems(state, action: PayloadAction<boolean>) {
      state.addingReqItems = action.payload;
    },

    addQuoteItem(state, action: PayloadAction<QuoteItem>) {
      state.quoteItems.push(action.payload);
    },
    removeQuoteItem(state, action: PayloadAction<number>) {
      state.quoteItems = state.quoteItems.filter((item) => item.id_item_cotacao !== action.payload);
    },
    addingIReqItems(state, action: PayloadAction<QuoteItem[]>) {
      state.quoteItems = [...state.quoteItems, ...action.payload];
    },
  },
});

export const {
  setQuoteItems,
  setAddingReqItems,
  addQuoteItem,
  removeQuoteItem,
  setSingleQuoteItem,
} = quoteItemSlice.actions;
export default quoteItemSlice.reducer;

