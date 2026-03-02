import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Project } from "../../models/Project";
import { ReducedUser } from "../../models/User";
import { RequisitionStatus } from "../../models/requisicoes/RequisitionStatus";
import { formatCurrency, getDateFromISOstring } from "../../utils";
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MutableRefObject, useMemo } from "react";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setRequisitionBeingDeletedId } from "../../redux/slices/requisicoes/requisitionTableSlice";
import { TextHeader } from "../../components/TextHeader";
import { calculateColumnWidth } from "../../utils/calculateColumnWidth";

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
  rows: any[] = []
) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { filters } = useSelector((state: RootState) => state.requisitionTable);

  // Calcula os widths uma única vez e memoriza
  const columnWidths = useMemo(() => {
    return {
      ID_REQUISICAO: calculateColumnWidth(rows, "ID_REQUISICAO", "ID"),
      DESCRIPTION: calculateColumnWidth(rows, "DESCRIPTION", "Descrição", undefined, undefined, 150, 400),
      projeto: calculateColumnWidth(rows, "projeto", "Projeto", (project: Project) => project?.DESCRICAO || ''),
      responsavel: calculateColumnWidth(rows, "responsavel", "Requisitante", (user: ReducedUser) => user?.NOME || ''),
      status: calculateColumnWidth(rows, "status", "Status", (status: RequisitionStatus) => status?.nome || ''),
      custo_total: calculateColumnWidth(rows, "custo_total", "Custo Total", (value) => formatCurrency(Number(value || 0))),
      gerente: calculateColumnWidth(rows, "gerente", "Gerente", (user: ReducedUser) => user?.NOME || ''),
      responsavel_projeto: calculateColumnWidth(rows, "responsavel_projeto", "Responsável Projeto", (user: ReducedUser) => user?.NOME || ''),
      comprador: calculateColumnWidth(rows, "comprador", "Comprador", (user: ReducedUser) => user?.NOME || ''),
      tipo_faturamento: calculateColumnWidth(rows, "tipo_faturamento", "Tipo", (value) => getTypeByTipoFaturamento(value)),
      criado_por: calculateColumnWidth(rows, "criado_por", "Criado por", (user: ReducedUser) => user?.NOME || ''),
      alterado_por: calculateColumnWidth(rows, "alterado_por", "Alterado por", (user: ReducedUser) => user?.NOME || ''),
      OBSERVACAO: calculateColumnWidth(rows, "OBSERVACAO", "Observação", undefined, undefined, 150, 400),
      data_alteracao: calculateColumnWidth(rows, "data_alteracao", "Data de Alteração", (value) => getDateFromISOstring(value)),
      data_criacao: calculateColumnWidth(rows, "data_criacao", "Data de Criação", (value) => getDateFromISOstring(value)),
    };
  }, [rows]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "ID_REQUISICAO",
        headerName: "ID",
        width: columnWidths.ID_REQUISICAO,
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
        width: columnWidths.DESCRIPTION,
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
        width: columnWidths.projeto,
        valueGetter: (project: Project) => {
          return project?.DESCRICAO || '';
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
        width: columnWidths.responsavel,
        valueGetter: (user: ReducedUser) => {
          return user?.NOME || '';
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
        field: "status",
        headerName: "Status",
        width: columnWidths.status,
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
        field: "custo_total",
        headerName: "Custo Total",
        width: columnWidths.custo_total,
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
        field: "gerente",
        headerName: "Gerente",
        width: columnWidths.gerente,
        valueGetter: (user: ReducedUser) => {
          return user?.NOME || '';
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
        width: columnWidths.responsavel_projeto,
        valueGetter: (user: ReducedUser) => {
          return user?.NOME || '';
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
        field: "comprador",
        headerName: "Comprador",
        width: columnWidths.comprador,
        valueGetter: (user: ReducedUser) => {
          return user ? user.NOME || '' : '';
        },
        renderHeader: () => (
          <TextHeader
            label={"Comprador"}
            field={"comprador"}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          ></TextHeader>
        ),
      },
      {
        field: "tipo_faturamento",
        headerName: "Tipo",
        width: columnWidths.tipo_faturamento,
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
      {
        field: "actions",
        headerName: "",
        width: 100,
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
    [filters, columnWidths, user, dispatch]
  );

  const secondaryColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "criado_por",
        headerName: "Criado por",
        width: columnWidths.criado_por,
        valueGetter: (user: ReducedUser) => {
          return user?.NOME || '';
        },
      },
      {
        field: "alterado_por",
        headerName: "Alterado por",
        width: columnWidths.alterado_por,
        valueGetter: (user: ReducedUser) => {
          return user?.NOME || '';
        },
      },
      {
        field: "OBSERVACAO",
        headerName: "Observação",
        width: columnWidths.OBSERVACAO,
      },
      {
        field: "data_alteracao",
        headerName: "Data de Alteração",
        width: columnWidths.data_alteracao,
        type: "date",
        valueGetter: (value) => {
          return getDateFromISOstring(value);
        },
      },
      {
        field: "data_criacao",
        headerName: "Data de Criação",
        width: columnWidths.data_criacao,
        type: "date",
        valueGetter: (value) => {
          return getDateFromISOstring(value);
        },
      },
      {
        field: "gerente",
        headerName: "Gerente",
        width: columnWidths.gerente,
        valueGetter: (user: ReducedUser) => {
          return user?.NOME || '';
        },
      },
    ],
    [columnWidths]
  );

  return { columns, secondaryColumns };
}
