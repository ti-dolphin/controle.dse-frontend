import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { logIn } from "../../Requisitions/utils";
import { useContext, useState } from "react";
import { userContext } from "../../Requisitions/context/userContext";
import { useNavigate } from 'react-router-dom';
import { Alert, AlertColor } from '@mui/material';
import { BaseButtonStyles } from '../../utilStyles';
import { AlertInterface } from '../../Requisitions/types';
function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © Dolphin Engenharia '}
           
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

 const SignIn = ( ) => {
    const navigate = useNavigate();
    const { toggleLogedIn, defineUser } = useContext(userContext)
    const [alert, setAlert] = useState<AlertInterface>();
    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const displayAlert = async (severity: string, message: string) => {
      setTimeout(() => {
        setAlert(undefined);
      }, 3000);
      setAlert({ severity, message });
      return;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const data = await logIn(user, password);
        defineUser(data);
        toggleLogedIn(true);
        navigate('/home');
      } catch (e: any) {
        displayAlert("error", e.response.data.message);
      }
    };

    return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Entrar
            </Typography>

            {alert && (
              <Alert
                severity={alert.severity as AlertColor}
                sx={{
                  width: "100%",
                  border: `1px solid ${
                    alert.severity === "error"
                      ? "red"
                      : alert.severity === "warning"
                      ? "orange"
                      : alert.severity === "info"
                      ? "blue"
                      : "green"
                  }`,
                }}
              >
                {alert.message}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                mt: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                width: {
                  xs: 300,
                  sm: 400,
                },
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="user"
                label="Usuário"
                name="user"
                autoFocus
                onChange={(e) => setUser(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <Button type='submit' sx={{ ...BaseButtonStyles }}>Entrar</Button>
            </Box>
          </Box>
          <Copyright />
        </Container>
      </ThemeProvider>
    );
}
export default SignIn;