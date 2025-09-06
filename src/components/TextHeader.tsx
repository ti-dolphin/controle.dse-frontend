import React, { useState, useMemo, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import { debounce } from "lodash";
import { OpportunityFilters } from "../hooks/oportunidades/useOpportunityFilters";
import { RequisitionFilters } from "../redux/slices/requisicoes/requisitionTableSlice";
import { PatrimonyFilters } from "../redux/slices/patrimonios/PatrimonyTableSlice";

interface TextHeaderProps {
  label: string;
  field: string;
  filters: OpportunityFilters | RequisitionFilters | PatrimonyFilters; 
  handleChangeFilters: (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => void;
}

export const TextHeader: React.FC<TextHeaderProps> = ({
  label,
  field,
  filters,
  handleChangeFilters,
}) => {
  const filterValue = filters[field as keyof typeof filters] ? String(filters[field as keyof typeof filters]) : "";
  const [localValue, setLocalValue] = useState<string>();

  const debouncedSync = useMemo(
    () =>
      debounce((value: string) => {
        handleChangeFilters(
          { target: { value: value === "" ? "" : value } } as any,
          field
        );
      }, 600),
    [handleChangeFilters, field]
  );

  useEffect(() => setLocalValue(filterValue), [filters]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <TextField
        placeholder={label}
        variant="standard"
        size="small"
        type="text"
        value={localValue || ''}
        onClick={(e) => e.stopPropagation()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setLocalValue(value);
          debouncedSync(value);
        }}
        InputProps={{
          sx: { fontSize: "12px" },
        }}
      />
    </Box>
  );
};
