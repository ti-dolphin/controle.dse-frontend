import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Adicione seus reducers aqui
// import exampleReducer from './exampleSlice';

export const store = configureStore({
  reducer: {
    user : userSlice.reducer
  },
});

// Tipos para uso com TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export const useAppDispatch: () => Dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 