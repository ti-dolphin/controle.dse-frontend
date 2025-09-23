import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
import React from "react";

// Define TypeScript interface for props
interface BaseDeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

const BaseDeleteDialog: React.FC<BaseDeleteDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  title = "Confirmar Exclusão",
  message = "Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.",
}) => {
  return (
    <Dialog 
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "500px",
          width: "100%",
          borderRadius: 2,
          p: 3, // Padding for the dialog content
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2, // Consistent spacing between elements
          p: 2,
        }}
      >
        {/* Title */}
        <Typography
          id="delete-dialog-title"
          variant="h6" // Changed to h6 for better hierarchy
          color="primary.main"
          fontWeight={600}
          textAlign="center"
        >
          {title}
        </Typography>

        {/* Message */}
        <Typography
          id="delete-dialog-description"
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          {message}
        </Typography>

        {/* Action Buttons */}
        <Stack direction="row" alignItems="center" gap={2}>
          <Button
            onClick={onConfirm}
            variant="contained"
          >
            Sim
          </Button>
          <Button
            onClick={onCancel}
            variant="contained"
            color="error"
       
          >
            Não
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default BaseDeleteDialog;
