import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    user: window.localStorage.getItem("user") ? JSON.parse(window.localStorage.getItem("user")) : null,
    token: window.localStorage.getItem('token'),
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
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
