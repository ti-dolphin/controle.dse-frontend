import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Project } from "../../models/Project";
import { ReducedUser } from "../../models/User";
import { Patrimony } from "../../models/patrimonios/Patrimony";
import { PatrimonyType } from "../../models/patrimonios/PatrimonyType";
import { Box, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { setFilters, setPatrimonyBeingDeleted } from "../../redux/slices/patrimonios/PatrimonyTableSlice";
import { RootState } from "../../redux/store";
import React from "react";


export const usePatMovementationColumns = ()=> {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const permissionToDelete = Number(user?.PERM_ADMINISTRADOR) === 1;
  const {filters} = useSelector((state: RootState) => state.patrionyTable);
  const handleDeleteClick =(row: Partial<Patrimony> ) => { 
    dispatch(setPatrimonyBeingDeleted(row))
  };

  const handleChangeFilters = React.useCallback(
      (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: string
      ) => {
        let value: any = e.target.value;
        if (value && !isNaN(Number(value)) && value.trim() !== "") {
          value = Number(value);
        }
  
        dispatch(setFilters({ ...filters, [field]: value }));
      },
      [dispatch, filters]
    );

  const columns: GridColDef[] = [
    {
      field: "id_patrimonio",
      headerName: "ID",
      type: "number",
      flex: 0.2,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "patrimonio_nserie",
      headerName: "Nº Série",
      flex: 0.6,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "start",
          }}
        >
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "patrimonio_nome",
      headerName: "Patrimônio",
      flex: 0.6,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "start",
          }}
        >
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },

    {
      field: "patrimonio_descricao",
      headerName: "Descrição",
      flex: 1.4,
    },
    {
      field: "patrimonio_tipo",
      headerName: "Tipo",
      flex: 0.3,
      valueGetter: (type: PatrimonyType) => type.nome_tipo || "N/A",
    },
    {
      field: "patrimonio_valor_compra",
      headerName: "Valor compra",
      type: "number",
      valueFormatter: (value: any) =>
        value ? `R$ ${Number(value).toFixed(2)}` : `R$ 0.00`,
      flex: 0.5,
    },
    {
      field: "projeto",
      headerName: "Projeto",
      valueGetter: (projeto: Project) => projeto.DESCRICAO || "N/A",
      flex: 1,
    },
    {
      field: "responsavel",
      headerName: "Responsável",
      width: 200,
      valueGetter: (user: ReducedUser) => user.NOME || "N/A",
      flex: 1,
    },
    {
      field: "gerente",
      headerName: "Gerente",
      width: 200,
      valueGetter: (user: ReducedUser) => user.NOME || "N/A",
      flex: 1,
    },
    { 
      field: 'actions',
      headerName: 'Ações',
      type: 'actions',
      renderCell: (params : GridRenderCellParams ) => { 
        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <IconButton disabled={!permissionToDelete}>
              <DeleteIcon color={permissionToDelete ? "error" : "disabled"} onClick={() => handleDeleteClick(params.row)} />
            </IconButton>
          </Box>
        );
      }
    }
    
  ];

  return { columns };
};
