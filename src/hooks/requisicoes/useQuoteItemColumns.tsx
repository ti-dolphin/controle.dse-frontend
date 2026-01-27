import { Box, Checkbox, IconButton, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ChangeEvent } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export const useQuoteItemColumns = (
  handleUpdateUnavailable: (params: ChangeEvent<HTMLInputElement>, itemId : number) => void,
  blockFields: boolean,
  onViewAttachments?: (id_item_requisicao: number) => void
)  => {

  

  const columns: GridColDef[] = [
    {
      field: "anexos",
      headerName: "Anexos",
      flex: 0.4,
      sortable: false,
      editable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <IconButton
            size="small"
            onClick={() => onViewAttachments?.(params.row.id_item_requisicao)}
            title="Ver anexos do item"
          >
            <AttachFileIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "produto_descricao",
      headerName: "Descrição do Produto",
      flex: 3.5,
      editable: false,
      renderCell: (params: any) => (
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
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "preco_unitario",
      headerName: "Preço Unitário",
      type: "number",
      flex: 0.6,
      editable: true,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "quantidade_solicitada",
      headerName: "Qtde. Solicitada",
      type: "number",
      flex: 0.7,
      editable: false,
    },
    {
      field: "quantidade_cotada",
      headerName: "Qtde. Cotada",
      type: "number",
      flex: 0.7,
      editable: true,
    },
    {
      field: "ICMS",
      headerName: "ICMS (%)",
      type: "number",
      flex: 0.5,
      editable: true,
    },
    {
      field: "IPI",
      headerName: "IPI (%)",
      type: "number",
      flex: 0.5,
      editable: true,
    },
    {
      field: "ST",
      headerName: "ST (%)",
      type: "number",
      flex: 0.5,
      editable: true,
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      flex: 0.5,
      editable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "observacao",
      headerName: "Observação",
      flex: 1,
      editable: true,
    },
    {
      field: "indisponivel",
      headerName: "Indisponivel",
      flex: 0.5,
      editable: false,
      renderCell: (params: any) => { 
     
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              disabled={blockFields}
              checked={Number(params.value) === 1 ? true : false}
              onChange={(changeParams) =>
                handleUpdateUnavailable(changeParams, Number(params.id))
              }
              inputProps={{ "aria-label": "Indisponível" }}
            />
          </Box>
        );
      },
    },
  ];

  return { columns };
};
