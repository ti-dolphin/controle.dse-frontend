import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    addingProducts: false,
    updatingRecentProductsQuantity: false,
    recentProductsAdded: [],
    productsAdded: [],
    replacingItemProduct: false,
    itemBeingReplaced: null,
    productSelected: null,
    refresh: false,
    newItems: []
};
const requisitionItemSlice = createSlice({
    name: "requisitionItem",
    initialState,
    reducers: {
        setAddingProducts(state, action) {
            state.addingProducts = action.payload;
        },
        setUpdatingRecentProductsQuantity(state, action) {
            state.updatingRecentProductsQuantity = action.payload;
        },
        setNewItems(state, action) {
            state.newItems = action.payload;
        },
        setRefresh(state, action) {
            state.refresh = action.payload;
        },
        setReplacingItemProduct(state, action) {
            state.replacingItemProduct = action.payload;
        },
        setProductSelected(state, action) {
            state.productSelected = action.payload;
        },
        setItemBeingReplaced(state, action) {
            state.itemBeingReplaced = action.payload;
        },
        setRecentAddedProducts(state, action) {
            state.recentProductsAdded = action.payload;
        },
        setProductsAdded(state, action) {
            state.productsAdded = action.payload;
        },
        removeRecentProduct(state, action) {
            state.recentProductsAdded = state.recentProductsAdded.filter((id) => id !== action.payload);
        },
        clearRecentProducts(state) {
            state.recentProductsAdded = [];
        },
        clearNewItems(state) {
            state.newItems = [];
        },
    },
});
export const { setAddingProducts, setUpdatingRecentProductsQuantity, setRecentAddedProducts, removeRecentProduct, clearRecentProducts, setNewItems, clearNewItems, setProductsAdded, setReplacingItemProduct, setItemBeingReplaced, setProductSelected, setRefresh } = requisitionItemSlice.actions;
export default requisitionItemSlice.reducer;
