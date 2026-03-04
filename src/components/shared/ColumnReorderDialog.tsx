import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CloseIcon from "@mui/icons-material/Close";

export interface ColumnItem {
  field: string;
  headerName: string;
}

interface ColumnReorderDialogProps {
  open: boolean;
  onClose: () => void;
  columns: ColumnItem[];
  onApply: (orderedFields: string[]) => void;
}

export function ColumnReorderDialog({
  open,
  onClose,
  columns,
  onApply,
}: ColumnReorderDialogProps) {
  const [items, setItems] = useState<ColumnItem[]>(columns);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    if (open) setItems(columns);
  }, [open]);

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    if (dragIndex.current === null || dragIndex.current === index) return;
    const newItems = [...items];
    const [dragged] = newItems.splice(dragIndex.current, 1);
    newItems.splice(index, 0, dragged);
    dragIndex.current = index;
    setItems(newItems);
  };

  const handleApply = () => {
    onApply(items.map((item) => item.field));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        Ordenar Colunas
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List dense disablePadding>
          {items.map((col, index) => (
            <ListItem
              key={col.field}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { dragIndex.current = null; }}
              sx={{
                cursor: "grab",
                borderBottom: "1px solid #f0f0f0",
                "&:hover": { backgroundColor: "#f5f5f5" },
                userSelect: "none",
                "&:active": { cursor: "grabbing" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <DragIndicatorIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </ListItemIcon>
              <ListItemText
                primary={col.headerName}
                primaryTypographyProps={{ fontSize: "13px" }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleApply} variant="contained" sx={{ borderRadius: 0 }}>
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
