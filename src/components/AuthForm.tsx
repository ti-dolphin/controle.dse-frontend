import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import {  AppDispatch } from "../redux/store";
import { setUser } from "../redux/slices/userSlice";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services/UserService";


const AuthForm: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
  const [LOGIN, setLOGIN] = useState("");
  const [SENHA, setSenha] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginData = await UserService.login({ LOGIN, SENHA });
      dispatch(setUser(loginData));
      dispatch(
        setFeedback({
          message: `Login realizado com sucesso! Bem-vindo(a) ${loginData.user.NOME}!`,
          type: "success",
        })
      );
    
      navigate("/");
    } catch (error : any) {
      dispatch(
        setFeedback({
          message: `Erro ao realizar login: Login ou senha inválidos.`,
          type: "error",
        })
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Login"
        value={LOGIN}
        onChange={(e) => setLOGIN(e.target.value)}
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Senha"
        type="password"
        value={SENHA}
        onChange={(e) => setSenha(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2, borderRadius: 2, fontWeight: 600, textTransform: 'capitalize'}}
      >
        Entrar
      </Button>
    </Box>
  );
};

export default AuthForm;
