import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar } from "@mui/material";
import SnackBar from "./components/shared/SnackBar";
import ProfileButton from "./components/shared/ProfileButton";
import { ptBR } from "@mui/material/locale";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2B3990",
    },
    secondary: {
      main: "#F7941E",
    },
    text: {
      primary: "#222831",
      secondary: "#606470",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  }
}, ptBR);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          {/* <AppBar
            position="absolute"
            color="inherit"
            elevation={0}
            sx={{ backgroundColor: "transparent", padding: 0 }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "flex-end", padding: 0, marginBottom: 2}}>
              <ProfileButton />
            </Toolbar>
          </AppBar> */}
          <SnackBar />
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
