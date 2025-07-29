import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import feedbackReducer from './slices/feedBackSlice';
import requisitionTableReducer from './slices/requisicoes/requisitionTableSlice';
import requisitionReducer from './slices/requisicoes/requisitionSlice';
import requisitionItemReducer from './slices/requisicoes/requisitionItemSlice';
import quoteReducer from './slices/requisicoes/quoteSlice';
import quoteItemReducer from './slices/requisicoes/quoteItemSlice';
import opportunityTableReducer from './slices/oportunidades/opportunityTableSlice';
import opportunityReducer from './slices/oportunidades/opportunitySlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    feedback: feedbackReducer,
    requisitionTable: requisitionTableReducer,
    requisition: requisitionReducer,
    requisitionItem: requisitionItemReducer,
    quote: quoteReducer,
    quoteItem: quoteItemReducer,
    opportunityTable : opportunityTableReducer,
    opportunity: opportunityReducer
  },
});

// Tipos para uso com TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
