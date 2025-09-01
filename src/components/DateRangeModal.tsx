import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { OpportunityFilters, useOpportunityFilters } from "../hooks/oportunidades/useOpportunityFilters";
import { set } from "lodash";
import { getDateStringFromISOstring } from "../utils";

interface DateRangeModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (inicio: string, fim: string) => void;
  field: string;
}

export const DateRangeModal: React.FC<DateRangeModalProps> = ({
  open,
  onClose,
  onApply,
  field
}) => {
  const{ activeFilters, filters } = useOpportunityFilters();
  const [inicio, setInicio] = useState<string>(
    String(filters[(field + "_FROM") as keyof OpportunityFilters])
  );
  const [fim, setFim] = useState<string>(
    String(filters[(field + "_TO") as keyof OpportunityFilters])
  );

  const handleApply = () => {
    onApply(inicio, fim);
    onClose();
  };

  const campos = [
    { label: "Data inicial", value: inicio, onChange: setInicio },
    { label: "Data final", value: fim, onChange: setFim },
  ];

  useEffect(() =>  {
    if (open) {
        console.log("field: ", field);
      if (
       activeFilters.some((f) => f.field === field + "_FROM") ||
       activeFilters.some((f) => f.field === field + "_TO")
      ) {
        console.log(
          "setando valores: ",
          filters[field + "_FROM" as keyof OpportunityFilters],
          filters[field + "_TO" as keyof OpportunityFilters]
        );
        setInicio(getDateStringFromISOstring(filters[field + "_FROM" as keyof OpportunityFilters] as string));
        setFim(getDateStringFromISOstring(filters[field + "_TO" as keyof OpportunityFilters] as string));
        return;
      }
        setInicio("");
        setFim("");
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Selecionar Período</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {campos.map(({ label, value, onChange }) => (
            <TextField
              key={label}
              label={label}
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleApply} color="primary" variant="contained">
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
