import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { formatCurrency } from "../../utils";

export const useSelectedQuoteItemColumns = (): GridColDef[] => {
  const columns: GridColDef[] = [
    {
      field: "produto_descricao",
      headerName: "Descrição do Produto",
      flex: 3.5,
      editable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "produto_unidade",
      headerName: "Unidade",
      flex: 0.5,
      editable: false,
    },
    {
      field: "quantidade_solicitada",
      headerName: "Qtd. Solicitada",
      flex: 0.8,
      editable: false,
      type: "number",
    },
    {
      field: "quantidade_cotada",
      headerName: "Qtd. Cotada",
      flex: 0.8,
      editable: false,
      type: "number",
    },
    {
      field: "preco_unitario",
      headerName: "Preço Unitário",
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px">{formatCurrency(Number(params.value))}</Typography>
        </Box>
      ),
    },
    {
      field: "ICMS",
      headerName: "ICMS %",
      flex: 0.6,
      editable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px">{params.value}%</Typography>
        </Box>
      ),
    },
    {
      field: "IPI",
      headerName: "IPI %",
      flex: 0.6,
      editable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px">{params.value}%</Typography>
        </Box>
      ),
    },
    {
      field: "ST",
      headerName: "ST %",
      flex: 0.6,
      editable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px">{params.value}%</Typography>
        </Box>
      ),
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px" fontWeight="bold" color="success.main">
            {formatCurrency(Number(params.value))}
          </Typography>
        </Box>
      ),
    },
  ];

  return columns;
};
