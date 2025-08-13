import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
const BaseDeleteDialog = ({ open, onConfirm, onCancel, title = "Confirmar Exclusão", message = "Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.", }) => {
    return (_jsx(Dialog, { open: open, onClose: onCancel, "aria-labelledby": "delete-dialog-title", "aria-describedby": "delete-dialog-description", sx: {
            "& .MuiDialog-paper": {
                maxWidth: "500px",
                width: "100%",
                borderRadius: 2,
                p: 3, // Padding for the dialog content
            },
        }, children: _jsxs(Box, { sx: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2, // Consistent spacing between elements
                p: 2,
            }, children: [_jsx(Typography, { id: "delete-dialog-title", variant: "h6" // Changed to h6 for better hierarchy
                    , color: "primary.main", fontWeight: 600, textAlign: "center", children: title }), _jsx(Typography, { id: "delete-dialog-description", variant: "body1", color: "text.secondary", textAlign: "center", sx: { mb: 2 }, children: message }), _jsxs(Stack, { direction: "row", alignItems: "center", gap: 2, children: [_jsx(Button, { onClick: onConfirm, variant: "contained", children: "Sim" }), _jsx(Button, { onClick: onCancel, variant: "contained", color: "error", children: "N\u00E3o" })] })] }) }));
};
export default BaseDeleteDialog;
