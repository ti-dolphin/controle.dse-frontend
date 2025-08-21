import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface BaseInputDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  inputLabel: string;
  inputValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BaseInputDialog: React.FC<BaseInputDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  inputLabel,
  inputValue,
  onInputChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={inputLabel}
          value={inputValue}
          onChange={onInputChange}
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BaseInputDialog;
