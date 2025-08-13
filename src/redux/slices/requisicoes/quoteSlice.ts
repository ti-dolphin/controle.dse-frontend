// quoteSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quote } from "../../../models/requisicoes/Quote";


interface QuoteState {
  quote: Quote | null;
  accessType: string | null;
 

}

const initialState: QuoteState = {
  quote: null,
  accessType: null
};

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    setQuote(state, action: PayloadAction<Quote>) {
      state.quote = action.payload as Quote;
    },
    setAccesType(state, action: PayloadAction<string>) {
      state.accessType = action.payload;
    },

    resetQuote(state) {
      state.quote = null;
    },
  },
});

export const { setQuote, resetQuote, setAccesType } = quoteSlice.actions;
export default quoteSlice.reducer;
