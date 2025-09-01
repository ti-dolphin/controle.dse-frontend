import React, { useCallback } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { GridFilterAltIcon, GridCloseIcon } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { OpportunityFilters } from "../hooks/oportunidades/useOpportunityFilters";
import { formatDateStringtoISOstring } from "../utils";
import { DateRangeModal } from "./DateRangeModal";
import { setFilters } from "../redux/slices/oportunidades/opportunityTableSlice";

interface DateHeaderProps {
  label: string;
  field: string;
  filters: OpportunityFilters;
  activeFilters: { field: string }[];
  openModal: { field: string; open: boolean };
  setOpenModal: (value: { field: string; open: boolean }) => void;
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  label,
  field,
  filters,
  activeFilters,
  openModal,
  setOpenModal,
}) => {
  const dispatch = useDispatch();

  const handleApplyDateFilter = useCallback(
    (from: string, to: string) => {
      dispatch(
        setFilters({
          ...filters,
          [`${field}_FROM` as keyof OpportunityFilters]: formatDateStringtoISOstring(from),
          [`${field}_TO` as keyof OpportunityFilters]: formatDateStringtoISOstring(to),
        })
      );
    },
    [dispatch, filters, field]
  );

  const isActive = activeFilters.some((f) =>
    [`${field}_FROM`, `${field}_TO`].includes(f.field)
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
      <Typography fontSize="12px">{label}</Typography>
      <Stack direction={"row"} alignItems="center" gap={1}>
        <IconButton
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setOpenModal({ field, open: true });
          }}
          sx={{ height: 20, width: 20 }}
        >
          <GridFilterAltIcon sx={{ fontSize: 16, color: "primary.main" }} />
        </IconButton>
        {isActive && (
          <IconButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              dispatch(
                setFilters({
                  ...filters,
                  [`${field}_FROM`]: null,
                  [`${field}_TO`]: null,
                })
              );
            }}
            sx={{ height: 20, width: 20 }}
          >
            <GridCloseIcon sx={{ fontSize: 16, color: "error.main" }} />
          </IconButton>
        )}
      </Stack>
      <DateRangeModal
        open={openModal.field === field && openModal.open}
        onClose={() => setOpenModal({ field: "", open: false })}
        onApply={(from, to) => handleApplyDateFilter(from, to)}
        field={field}
      />
    </Box>
  );
};
