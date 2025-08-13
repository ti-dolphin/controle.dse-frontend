//feedBackSlice.ts
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    message: null,
    type: null,
};
const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        setFeedback(state, action) {
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        clearFeedback(state) {
            state.message = null;
            state.type = null;
        },
    },
});
export const { setFeedback, clearFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
