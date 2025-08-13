import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services/UserService";
const AuthForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [LOGIN, setLOGIN] = useState("");
    const [SENHA, setSenha] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginData = await UserService.login({ LOGIN, SENHA });
            dispatch(setUser(loginData));
            dispatch(setFeedback({
                message: `Login realizado com sucesso! Bem-vindo(a) ${loginData.user.NOME}!`,
                type: "success",
            }));
            navigate("/");
        }
        catch (error) {
            dispatch(setFeedback({
                message: `Erro ao realizar login: Login ou senha inválidos.`,
                type: "error",
            }));
        }
    };
    return (_jsxs(Box, { component: "form", onSubmit: handleLogin, sx: { mt: 1 }, children: [_jsx(TextField, { margin: "normal", required: true, fullWidth: true, label: "Login", value: LOGIN, onChange: (e) => setLOGIN(e.target.value), autoFocus: true }), _jsx(TextField, { margin: "normal", required: true, fullWidth: true, label: "Senha", type: "password", value: SENHA, onChange: (e) => setSenha(e.target.value) }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", color: "primary", sx: { mt: 2, borderRadius: 2, fontWeight: 600, textTransform: 'capitalize' }, children: "Entrar" })] }));
};
export default AuthForm;
