import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {  clearUser } from "../redux/slices/userSlice";
import { Box, Button, Typography, Paper, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthForm from "../components/AuthForm";

const AuthPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const token = window.localStorage.getItem("token");


  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"
      minHeight="100vh"
      bgcolor="#f5f6fa"
    >
      <Paper elevation={2} sx={{ p: 4, width: "100%" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Login
          </Typography>
          {token && user ? (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Olá, {user.NOME}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          ) : (
            <AuthForm />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;
