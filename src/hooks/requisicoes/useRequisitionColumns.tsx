import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Project } from "../../models/Project";
import { ReducedUser } from "../../models/User";
import { RequisitionStatus } from "../../models/requisicoes/RequisitionStatus";
import { formatCurrency, getDateFromISOstring } from "../../utils";
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MutableRefObject, useMemo } from "react";
import { RequisitionType } from "../../models/requisicoes/RequisitionType";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setRequisitionBeingDeletedId } from "../../redux/slices/requisicoes/requisitionTableSlice";
import { TextHeader } from "../../components/TextHeader";

const getTypeByTipoFaturamento = (tipoFaturamento: any) => {
  switch (tipoFaturamento) {
    case 1:
      return "Faturamento Dolphin";
    case 2:
      return "Faturamento Direto";
    case 3:
      return "Compras Operacional";
    case 4:
      return "Estoque";
    case 5:
      return "Estoque Operacional";
    case 6:
      return "Compras TI";
    case 7:
      return "Estoque TI";
    default:
      return "-";
  }
};

export function useRequisitionColumns(
  handleChangeFilters : (event: React.ChangeEvent<HTMLInputElement>, field: string) => void,
  changeSelectedRow: (row: any) => void,
  _gridRef: MutableRefObject<GridApiCommunity>,
) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { filters } = useSelector((state: RootState) => state.requisitionTable);
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "ID_REQUISICAO",
        headerName: "ID",
        flex: 0.6,
        renderHeader: () => (
          <TextHeader
            label={"ID"}
            field={"ID_REQUISICAO"}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          ></TextHeader>
        ),
      },
      {
        field: "DESCRIPTION",
        headerName: "Descrição",
        flex: 2,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Typography
                fontSize="12px"
                fontWeight="bold"
                color="text.primary"
              >
                {params.value}
              </Typography>
            </Box>
          );
        },
        renderHeader: () => (
          <TextHeader
            label={"Descrição"}
            field={"DESCRIPTION"}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          ></TextHeader>
        ),
      },
      {
        field: "projeto",
        headerName: "Projeto",
        flex: 1,
        valueGetter: (project: Project) => {
          return project.DESCRICAO;
        },
        renderHeader: () => (
          <TextHeader
            label={"Projeto"}
            field={"projeto"}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          ></TextHeader>
        ),
      },
      {
        field: "responsavel",
        headerName: "Requisitante",
        flex: 1,
        valueGetter: (user: ReducedUser) => {
          return user.NOME || '';
        },
        renderHeader: () => (
          <TextHeader
            label={"Requisitante"}
            field={"responsavel"}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          ></TextHeader>
        ),
      },
      {
        field: "gerente",
        headerName: "Gerente",
        flex: 1,
        valueGetter: (user: ReducedUser) => {
          return user.NOME || '';
        },
        renderHeader: () => (
          <TextHeader
            label={"Gerente"}
            field={"gerente"}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          ></TextHeader>
        ),
      },
      {
        field: "responsavel_projeto",
        headerName: "Responsável Projeto",
        flex: 1,
        valueGetter: (user: ReducedUser) => {
          return user.NOME || '';
        },
        renderHeader: () => (
          <TextHeader
            label={"Responsável Projeto"}
            field={"responsavel_projeto"}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          ></TextHeader>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        valueGetter: (status: RequisitionStatus) => {
          return status ? status.nome : "";
        },
        renderHeader: () => (
          <TextHeader
            label={"Status"}
            field={"status"}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          ></TextHeader>
        ),
      },
      {
        field: "tipo_faturamento",
        headerName: "Tipo",
        flex: 1,
        valueGetter: (tipoFaturamento: number) => {
          return getTypeByTipoFaturamento(tipoFaturamento);
        },
        renderHeader: () => (
          <TextHeader
            label={"Tipo"}
            field={"tipo_faturamento"}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          ></TextHeader>
        ),
      },
      // {
      //   field: "data_criacao",
      //   headerName: "Data de Criação",
      //   flex: 0.5,
      //   type: "date",
      //   valueGetter: (value) => {
      //     return getDateFromISOstring(value);
      //   },
      // },
      {
        field: "custo_total",
        headerName: "Custo Total",
        flex: 0.4,
        type: "number",
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              {formatCurrency(Number(params.value))}
            </Box>
          );
        },
      },
      {
        field: "actions",
        headerName: "",
        flex: 0.5,

        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          return (
            <Box
              sx={{ zIndex: 30, display: "flex", alignItems: "center", gap: 1 }}
            >
              <IconButton
                onClick={() => {
                  changeSelectedRow(row);
                }}
                sx={{ color: "primary.main" }}
              >
                <VisibilityIcon />
              </IconButton>
              {user?.PERM_ADMINISTRADOR === 1 && (
                <IconButton
                  onClick={() => {
                    dispatch(setRequisitionBeingDeletedId(row.ID_REQUISICAO));
                  }}
                >
                  <DeleteIcon sx={{ color: "error.main" }} />
                </IconButton>
              )}
            </Box>
          );
        },
      },
    ],
    [filters]
  );

  const secondaryColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "criado_por",
        headerName: "Criado por",
        flex: 1,
        valueGetter: (user: ReducedUser) => {
          return user.NOME || '';
        },
      },
      {
        field: "alterado_por",
        headerName: "Alterado por",
        flex: 1,
        valueGetter: (user: ReducedUser) => {
          return user.NOME || '';
        },
      },
      {
        field: "OBSERVACAO",
        headerName: "Observação",
        flex: 1,
      },
      {
        field: "data_alteracao",
        headerName: "Data de Alteração",
        flex: 1,
        type: "date",
        valueGetter: (value) => {
          return getDateFromISOstring(value);
        },
      },
      {
        field: "data_criacao",
        headerName: "Data de Criação",
        flex: 1,
        type: "date",
        valueGetter: (value) => {
          return getDateFromISOstring(value);
        },
      },
      {
        field: "gerente",
        headerName: "Gerente",
        flex: 1,
        valueGetter: (user: ReducedUser) => {
          return user.NOME || '';
        },
      },
    ],
    []
  );

  return { columns, secondaryColumns };
}
