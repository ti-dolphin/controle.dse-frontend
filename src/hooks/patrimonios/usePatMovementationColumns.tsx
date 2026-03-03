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
import React, { useMemo } from "react";
import { TextHeader } from "../../components/TextHeader";
import { calculateColumnWidth } from "../../utils/calculateColumnWidth";


export const usePatMovementationColumns = (rows: any[] = []) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const permissionToDelete = Number(user?.PERM_ADMINISTRADOR) === 1;
  const {filters} = useSelector((state: RootState) => state.patrionyTable);

  // Calcula os widths uma única vez e memoriza
  const columnWidths = useMemo(() => {
    return {
      id_patrimonio: calculateColumnWidth(rows, "id_patrimonio", "ID"),
      patrimonio_nserie: calculateColumnWidth(rows, "patrimonio_nserie", "Nº Série"),
      patrimonio_nome: calculateColumnWidth(rows, "patrimonio_nome", "Patrimônio"),
      patrimonio_descricao: calculateColumnWidth(rows, "patrimonio_descricao", "Descrição"),
      patrimonio_tipo: calculateColumnWidth(rows, "patrimonio_tipo", "Tipo", (type: PatrimonyType) => type.nome_tipo || "N/A"),
      patrimonio_valor_compra: calculateColumnWidth(rows, "patrimonio_valor_compra", "Valor compra", (value: any) => value ? `R$ ${Number(value).toFixed(2)}` : `R$ 0.00`),
      projeto: calculateColumnWidth(rows, "projeto", "Projeto", (projeto: Project) => projeto.DESCRICAO || "N/A"),
      responsavel: calculateColumnWidth(rows, "responsavel", "Responsável", (user: ReducedUser) => user?.NOME || 'N/A'),
      gerente: calculateColumnWidth(rows, "gerente", "Gerente", (user: ReducedUser) => user?.NOME || 'N/A'),
    };
  }, [rows]);
  const handleDeleteClick =(row: Partial<Patrimony>) => { 
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

  const columns: GridColDef[] = useMemo(() => [
    {
      field: "id_patrimonio",
      headerName: "ID",
      type: "number",
      width: columnWidths.id_patrimonio,
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
      width: columnWidths.patrimonio_nserie,
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
      width: columnWidths.patrimonio_nome,
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
      width: columnWidths.patrimonio_descricao,
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
      width: columnWidths.patrimonio_tipo,
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
      width: columnWidths.patrimonio_valor_compra,
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
      width: columnWidths.projeto,
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
      width: columnWidths.responsavel,
      valueGetter: (user: ReducedUser) => user?.NOME || "N/A",
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
      width: columnWidths.gerente,
      valueGetter: (user: ReducedUser) => user?.NOME || "N/A",
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
  ], [filters, columnWidths, permissionToDelete]);

  return { columns };
};
