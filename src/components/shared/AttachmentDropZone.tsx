import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

interface AttachmentDropZoneProps {
  disabled?: boolean;
  onFiles: (files: File[]) => void;
  children: React.ReactNode;
}

const AttachmentDropZone = ({ disabled, onFiles, children }: AttachmentDropZoneProps) => {
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  return (
    <Box
      onDragEnter={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return;
        event.preventDefault();
        event.stopPropagation();
        dragDepth.current += 1;
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = disabled ? "none" : "copy";
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepth.current = 0;
        setDragging(false);
        const files = Array.from(event.dataTransfer.files);
        if (!disabled && files.length > 0) onFiles(files);
      }}
      sx={{
        border: "2px dashed",
        borderColor: dragging && !disabled ? "primary.main" : "divider",
        bgcolor: dragging && !disabled ? "action.hover" : "background.paper",
        borderRadius: 1,
        p: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {dragging && !disabled
          ? "Solte os arquivos aqui para anexar."
          : "Arraste arquivos aqui ou clique em Adicionar Anexo."}
      </Typography>
      {children}
    </Box>
  );
};

export default AttachmentDropZone;
