import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Badge, BadgeProps, Box, IconButton, styled, Tooltip, Typography } from "@mui/material";
import { blue, green, red } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { set } from "lodash";
import { useIsMobile } from "./useIsMobile";
import FileIcon from '@mui/icons-material/FilePresent';
import { setViewingProductAttachment } from "../redux/slices/productSlice";
import CircleIcon from '@mui/icons-material/Circle';
import { useProductPermissions } from "./productPermissionsHook";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    padding: "0 4px",
  },
}));

export const useProductColumns = () => {
  const dispatch = useDispatch();
  const {
    addingProducts,
    replacingItemProduct,
  } = useSelector((state: RootState) => state.requisitionItem);

  const { viewingProducts } = useSelector((state: RootState) => state.productSlice);

  const { isMobile } = useIsMobile();
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const { editProductFieldsPermitted, hasStockPermission } = useProductPermissions(user);

  const addingProductsColumns: GridColDef[] = [
    {
      field: "ID",
      headerName: "ID",
      type: "number",
      flex: 0.1,
      editable: false,
    },
    {
      field: "codigo",
      headerName: "Código Produto",
      type: "string",
      flex: 0.5,
      editable: false,
      valueGetter: (value) => value || "",
    },
    {
      field: "descricao",
      headerName: "Descrição",
      type: "string",
      flex: 1,
      editable: false,
      valueGetter: (value) => value || "",
    },
    {
      field: "unidade",
      headerName: "Unidade",
      type: "string",
      flex: 0.2,
      editable: false,
      valueGetter: (value) => value || "",
    },
    {
      field: "quantidade_disponivel",
      headerName: "Disponivel",

      type: "number",
      flex: 0.2,
      editable: false,
      valueGetter: (value) => value || 0,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              height: "100%",
              padding: 1,
              backgroundColor: params.value > 0 ? green[200] : red[200],
            }}
          >
            <Typography fontSize="12px" fontWeight={"bold"}>
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const mobileColumns: GridColDef[] = [
    {
      field: "codigo",
      headerName: "Código Produto",
      type: "string",
      flex: 0.5,
      editable: false,
      valueGetter: (value) => value || "",
    },
    {
      field: "descricao",
      headerName: "Descrição",
      type: "string",
      flex: 1,
      editable: false,
      valueGetter: (value) => value || "",
    },
    {
      field: "unidade",
      headerName: "Unidade",
      type: "string",
      flex: 0.2,
      editable: false,
      valueGetter: (value) => value || "",
    },
    {
      field: "quantidade_disponivel",
      headerName: "Disponivel",

      type: "number",
      flex: 0.2,
      editable: false,
      valueGetter: (value) => value || 0,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              height: "100%",
              padding: 1,
              backgroundColor: params.value > 0 ? green[200] : red[200],
            }}
          >
            <Typography fontSize="12px" fontWeight={"bold"}>
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "",
      headerName: "Anexos",
      flex: 0.2,
      editable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              height: "100%",
              padding: 1,
              backgroundColor: params.value > 0 ? green[200] : red[200],
            }}
          >
            <IconButton sx={{ height: 24, width: 24 }}>
              <FileIcon />
            </IconButton>
          </Box>
        );
      },
    }
  ];

  const viewingProductsColumns: GridColDef[] = [
    {
      field: "ID",
      headerName: "ID",
      type: "number",
      flex: 0.1,
      editable: false,
    },
    {
      field: "codigo",
      headerName: "Código Produto",
      type: "string",
      flex: 0.5,
      editable: false,
      valueGetter: (value) => value || "",
    },
    {
      field: "descricao",
      headerName: "Descrição",
      type: "string",
      flex: 1,
      editable: false,
      valueGetter: (value) => value || "",
    },
    {
      field: "unidade",
      headerName: "Unidade",
      type: "string",
      flex: 0.15,
      editable: false,
      valueGetter: (value) => value || "",
    },

    {
      field: "quantidade_estoque",
      headerName: "Estoque",
      type: "number",
      flex: 0.15,
      editable: editProductFieldsPermitted || hasStockPermission,
      valueGetter: (value) => value || 0,
    },
    {
      field: "quantidade_reservada",
      headerName: "Reservado",
      type: "number",
      flex: 0.15,
      editable: false,
      valueGetter: (value) => value || 0,
    },
    {
      field: "quantidade_disponivel",
      headerName: "Disponível",
      type: "number",
      flex: 0.15,
      editable: false,
      valueGetter: (value) => value || 0,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              height: "100%",
              padding: 1,

            }}
          >
            <Typography fontSize="12px" color={params.value > 0 ? green[600] : red[600]} fontWeight={"bold"}>
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "anexos",
      headerName: "anexos",
      flex: 0.15,
      editable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: 1,
            }}
          >
            <IconButton onClick={() => { dispatch(setViewingProductAttachment(params.row.ID)) }}>
              <StyledBadge
                variant="standard"
                badgeContent={params.row.anexos.length}
                color="primary"
              >
                <FileIcon sx={{ fontSize: 14 }} />
              </StyledBadge>
            </IconButton>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    if (isMobile) {
      setColumns(mobileColumns);
      return;
    }
    if (addingProducts || replacingItemProduct) {
      setColumns(addingProductsColumns);
      return;
    }
    if (viewingProducts) {
      setColumns(viewingProductsColumns);
      return;
    }

  }, []);
  return { columns };
}