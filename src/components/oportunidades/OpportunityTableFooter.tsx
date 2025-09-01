import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { GridFooterContainer, GridPagination } from "@mui/x-data-grid";
import { formatCurrency } from "../../utils";

export const OpportunityTableFooter: React.FC = () => {
  const totals = useSelector((state: any) => state.opportunityTable.totals);

  return (
  <GridFooterContainer>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderTop: "1px solid #ddd",
        gap: 1,
      }}
    >
      <Typography variant="body1" color="textSecondary" fontSize="small">
        Total:{" "}
        <strong style={{ color: "green", fontSize: "small" }}>
          {formatCurrency(totals.total)}
        </strong>
      </Typography>
      <Typography variant="body1" color="textSecondary" fontSize="small">
        Total Fat Dolphin:{" "}
        <strong style={{ color: "green", fontSize: "small" }}>
          {formatCurrency(totals.totalFatDolphin)}
        </strong>
      </Typography>
      <Typography variant="body1" color="textSecondary" fontSize="small">
        Total Fat Direto:{" "}
        <strong style={{ color: "green", fontSize: "small" }}>
          {formatCurrency(totals.totalFatDireto)}
        </strong>
      </Typography>
    </Box>
    <GridPagination />
  </GridFooterContainer>
  )
};