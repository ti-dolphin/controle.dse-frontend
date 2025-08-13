// quoteSlice.ts
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    quote: null,
    accessType: null
};
const quoteSlice = createSlice({
    name: "quote",
    initialState,
    reducers: {
        setQuote(state, action) {
            state.quote = action.payload;
        },
        setAccesType(state, action) {
            state.accessType = action.payload;
        },
        resetQuote(state) {
            state.quote = null;
        },
    },
});
export const { setQuote, resetQuote, setAccesType } = quoteSlice.actions;
export default quoteSlice.reducer;
