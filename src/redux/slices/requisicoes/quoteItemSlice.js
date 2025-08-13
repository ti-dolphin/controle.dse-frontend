import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    quoteItems: [],
    addingReqItems: false,
};
const quoteItemSlice = createSlice({
    name: "quoteItem",
    initialState,
    reducers: {
        setQuoteItems(state, action) {
            state.quoteItems = action.payload;
        },
        setSingleQuoteItem(state, action) {
            state.quoteItems = state.quoteItems.map((item) => {
                if (item.id_item_cotacao === action.payload.id_item_cotacao) {
                    return action.payload;
                }
                return item;
            });
        },
        setAddingReqItems(state, action) {
            state.addingReqItems = action.payload;
        },
        addQuoteItem(state, action) {
            state.quoteItems.push(action.payload);
        },
        removeQuoteItem(state, action) {
            state.quoteItems = state.quoteItems.filter((item) => item.id_item_cotacao !== action.payload);
        },
        addingIReqItems(state, action) {
            state.quoteItems = [...state.quoteItems, ...action.payload];
        },
    },
});
export const { setQuoteItems, setAddingReqItems, addQuoteItem, removeQuoteItem, setSingleQuoteItem, } = quoteItemSlice.actions;
export default quoteItemSlice.reducer;
