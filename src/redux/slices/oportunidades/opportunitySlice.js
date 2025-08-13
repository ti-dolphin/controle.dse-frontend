import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    creating: false,
    viewing: false,
    editing: false,
    deleting: false,
    opportunity: null,
    deletingOpp: null
};
const opportunitySlice = createSlice({
    name: "opportunity",
    initialState,
    reducers: {
        setCreating(state, action) {
            state.creating = action.payload;
        },
        setViewing(state, action) {
            state.viewing = action.payload;
        },
        setEditing(state, action) {
            state.editing = action.payload;
        },
        setDeleting(state, action) {
            state.deleting = action.payload;
        },
        setDeletingOpp(state, action) {
            state.deletingOpp = action.payload;
        },
        setOpportunity(state, action) {
            state.opportunity = action.payload;
        },
    },
});
export const { setCreating, setViewing, setEditing, setDeleting, setOpportunity, } = opportunitySlice.actions;
export default opportunitySlice.reducer;
