import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, } from "@mui/material";
import { debounce } from "lodash";
const FillAllDialog = ({ open, onClose, onConfirm, value, onChange, label, type = "text", title, }) => {
    const [localValue, setLocalValue] = React.useState(value || "");
    const debouncedChangeHandler = React.useCallback(debounce((e) => onChange(e), 500), [onChange]);
    const handleConfirm = () => {
        setLocalValue('');
        onConfirm();
    };
    const handleChange = (e) => {
        setLocalValue(e.target.value);
        debouncedChangeHandler(e);
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, children: [_jsx(DialogTitle, { children: _jsx(Typography, { color: "primary", variant: "h6", children: title }) }), _jsxs(DialogContent, { sx: {
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "start",
                    flexDirection: "column",
                    gap: 2,
                }, children: [_jsx(TextField, { value: localValue, onChange: handleChange, label: label, InputLabelProps: { shrink: true }, type: type, placeholder: type === "date" ? "dd/mm/aaaa" : "", sx: { mt: 2 }, fullWidth: true }), _jsx(Button, { onClick: handleConfirm, variant: "contained", children: "Concluir" })] })] }));
};
export default FillAllDialog;
