import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { debounce } from "lodash";

interface FillAllDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  type?: string;
  title: string;
}

const FillAllDialog: React.FC<FillAllDialogProps> = ({
  open,
  onClose,
  onConfirm,
  value,
  onChange,
  label,
  type = "text",
  title,
}) => {

  const [localValue, setLocalValue] = React.useState(value || "");

  const debouncedChangeHandler = React.useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => onChange(e), 500),
    [onChange]
  );

  const handleConfirm = ( ) => {
    setLocalValue('');
    onConfirm();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    debouncedChangeHandler(e);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography color="primary" variant="h6">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          alignItems: "start",
          justifyContent: "start",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          value={localValue}
          onChange={handleChange}
          label={label}
          InputLabelProps={{ shrink: true }}
          type={type}
          placeholder={type === "date" ? "dd/mm/aaaa" : ""}
          sx={{ mt: 2 }}
          fullWidth
        />
        <Button onClick={handleConfirm} variant="contained">
          Concluir
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FillAllDialog;
