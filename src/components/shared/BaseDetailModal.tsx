import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Divider, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GridColDef } from "@mui/x-data-grid";
import { getDateStringFromDateObject, getDateStringFromISOstring } from "../../utils";

interface BaseDetailModalProps<T> {
  open: boolean;
  onClose: () => void;
  columns: GridColDef[];
  row: T | null;
  ref: React.MutableRefObject<any>;
  title?: string;
}


function detectType(value: unknown): "date" | "number" | "string" {
  if (value instanceof Date) return "date";
  if (typeof value === "number") return "number";
  if (typeof value === "string") return "string";
  return "string";
}



export function BaseDetailModal<T>({ open, onClose, columns, row, title, ref }: BaseDetailModalProps<T>) {
  if (!row) return null;

  function getValue(row: any, col: GridColDef) {
    const { field } = col;
    if (typeof col.valueGetter === "function") {
      const value = col.valueGetter(row[col.field] as never, row, col, ref);
      if (detectType(value) === "date") {
        return getDateStringFromDateObject(value);
      }
      return value;
    }
    return row[field];
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{display: 'flex', justifyContent: 'end'}}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'primary.main' }}>
        {title || 'Detalhes'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {columns.map((col) => (
            <React.Fragment key={col.field}>
              <Grid item xs={5}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {col.headerName}
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body2" color="text.primary">
                  {getValue(row, col)}
                </Typography>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
            </React.Fragment>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default BaseDetailModal;
