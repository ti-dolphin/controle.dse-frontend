import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import feedbackReducer from './slices/feedBackSlice';
import requisitionTableReducer from './slices/requisicoes/requisitionTableSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    feedback: feedbackReducer,
    requisitionTable: requisitionTableReducer,
  },
});

// Tipos para uso com TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
