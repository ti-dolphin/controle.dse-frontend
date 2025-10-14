import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from "../../models/User";

interface UserState {
  user: User | null;
  token: string | null;
}


const initialState: UserState = {
  user: window.localStorage.getItem("user") && window.localStorage.getItem("user") !== "undefined" ? JSON.parse(window.localStorage.getItem("user") as string) : null,
  token: window.localStorage.getItem('token') && window.localStorage.getItem('token') !== "undefined" ? window.localStorage.getItem('token') : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    clearUser(state) {
      state.user = null;
      state.token = null;

      // Removendo do localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
