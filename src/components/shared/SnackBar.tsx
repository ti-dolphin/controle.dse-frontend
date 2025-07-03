import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { RootState } from "../../redux/store";
import { clearFeedback } from "../../redux/slices/feedBackSlice";

const SnackBar: React.FC = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state: RootState) => state.feedback);

  const open = Boolean(message);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(clearFeedback());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={type || 'info'}
        sx={{ width: '100%', color: 'white' }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
