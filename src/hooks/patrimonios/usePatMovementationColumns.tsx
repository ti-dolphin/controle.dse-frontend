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
import { TextHeader } from "../../components/TextHeader";


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
      flex: 0.5,
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
      renderHeader: () => (
        <TextHeader
          label={"ID"}
          field={"id_patrimonio"}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
        />
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
      renderHeader: () => (
        <TextHeader
          label={"Nº Série"}
          field={"patrimonio_nserie"}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
        />
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
      renderHeader: () => (
        <TextHeader
          label={"Patrimônio"}
          field={"patrimonio_nome"}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
        />
      ),
    },
    {
      field: "patrimonio_descricao",
      headerName: "Descrição",
      flex: 1.4,
      renderHeader: () => (
        <TextHeader
          label={"Descrição"}
          field={"patrimonio_descricao"}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
        />
      ),
    },
    {
      field: "patrimonio_tipo",
      headerName: "Tipo",
      flex: 0.3,
      valueGetter: (type: PatrimonyType) => type.nome_tipo || "N/A",
      renderHeader: () => (
        <TextHeader
          label={"Tipo"}
          field={"patrimonio_tipo"}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
        />
      ),
    },
    {
      field: "patrimonio_valor_compra",
      headerName: "Valor compra",
      type: "number",
      valueFormatter: (value: any) =>
        value ? `R$ ${Number(value).toFixed(2)}` : `R$ 0.00`,
      flex: 0.5,
      renderHeader: () => (
        <TextHeader
          label={"Valor compra"}
          field={"patrimonio_valor_compra"}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
        />
      ),
    },
    {
      field: "projeto",
      headerName: "Projeto",
      valueGetter: (projeto: Project) => projeto.DESCRICAO || "N/A",
      flex: 1,
      renderHeader: () => (
        <TextHeader
          label={"Projeto"}
          field={"projeto"}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
        />
      ),
    },
    {
      field: "responsavel",
      headerName: "Responsável",
      width: 200,
      valueGetter: (user: ReducedUser) => user.NOME || "N/A",
      flex: 1,
      renderHeader: () => (
        <TextHeader
          label={"Responsável"}
          field={"responsavel"}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
        />
      ),
    },
    {
      field: "gerente",
      headerName: "Gerente",
      width: 200,
      valueGetter: (user: ReducedUser) => user.NOME || "N/A",
      flex: 1,
      renderHeader: () => (
        <TextHeader
          label={"Gerente"}
          field={"gerente"}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <IconButton disabled={!permissionToDelete}>
              <DeleteIcon
                color={permissionToDelete ? "error" : "disabled"}
                onClick={() => handleDeleteClick(params.row)}
              />
            </IconButton>
          </Box>
        );
      }
    },
  ];

  return { columns };
};
