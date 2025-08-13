import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/slices/userSlice";
import { Box, Button, Typography, Paper, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthForm from "../components/AuthForm";
const AuthPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const token = window.localStorage.getItem("token");
    const handleLogout = () => {
        dispatch(clearUser());
    };
    return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "start", minHeight: "100vh", bgcolor: "#f5f6fa", children: _jsx(Paper, { elevation: 2, sx: { p: 4, width: "100%" }, children: _jsxs(Box, { display: "flex", flexDirection: "column", alignItems: "center", children: [_jsx(Avatar, { sx: { m: 1, bgcolor: "secondary.main" }, children: _jsx(LockOutlinedIcon, {}) }), _jsx(Typography, { component: "h1", variant: "h5", sx: { fontWeight: 600, mb: 2 }, children: "Login" }), token && user ? (_jsxs(_Fragment, { children: [_jsxs(Typography, { variant: "body1", sx: { mb: 2 }, children: ["Ol\u00E1, ", user.NOME] }), _jsx(Button, { variant: "contained", color: "primary", fullWidth: true, onClick: handleLogout, children: "Sair" })] })) : (_jsx(AuthForm, {}))] }) }) }));
};
export default AuthPage;
