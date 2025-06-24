//feedBackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FeedbackState {
  message: string | null;
  type: 'success' | 'error' | null;
}
const initialState: FeedbackState = {
  message: null,
  type: null,
};
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setFeedback(state, action: PayloadAction<{ message: string; type: 'success' | 'error' }>) {
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