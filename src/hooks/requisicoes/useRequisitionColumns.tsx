import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Project } from "../../models/Project";
import { ReducedUser } from "../../models/User";
import { RequisitionStatus } from "../../models/requisicoes/RequisitionStatus";
import { formatCurrency, getDateFromISOstring } from "../../utils";
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MutableRefObject, useMemo, useCallback } from "react";
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
  const { filters, rows } = useSelector((state: RootState) => state.requisitionTable);

  const calculateOptimalColumnWidth = useCallback((
    data: any[],
    fieldName: string,
    valueGetter: ((value: any) => string) | null = null,
    minWidth: number = 80,
    maxWidth: number = 600,
    charWidth: number = 8,
    padding: number = 40
  ): number => {
    if (!data || data.length === 0) {
      return minWidth;
    }

    const longestText = data.reduce((longest, item) => {
      let text = '';
      if (valueGetter) {
        text = String(valueGetter(item[fieldName]) || '');
      } else {
        text = String(item[fieldName] || '');
      }
      return text.length > longest.length ? text : longest;
    }, '');

    const calculatedWidth = (longestText.length * charWidth) + padding;
    
    return Math.max(minWidth, Math.min(calculatedWidth, maxWidth));
  }, []);

  // Calculate widths for each column based on content
  const idColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'ID_REQUISICAO', null, 60, 120, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const descriptionColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'DESCRIPTION', null, 200, 600, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const projectColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'projeto', (p: Project) => p ? p.DESCRICAO : '', 150, 400, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const requisitanteColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'responsavel', (u: ReducedUser) => u ? u.NOME || '' : '', 150, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const gerenteColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'gerente', (u: ReducedUser) => u ? u.NOME || '' : '', 150, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const responsavelProjetoColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'responsavel_projeto', (u: ReducedUser) => u ? u.NOME || '' : '', 150, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const compradorColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'comprador', (u: ReducedUser) => u ? u.NOME || '' : '', 150, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const statusColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'status', (s: RequisitionStatus) => s ? s.nome : '', 120, 250, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const tipoColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'tipo_faturamento', (t: number) => getTypeByTipoFaturamento(t), 150, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  // Calculate widths for secondary columns
  const criadoPorColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'criado_por', (u: ReducedUser) => u ? u.NOME || '' : '', 150, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const alteradoPorColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'alterado_por', (u: ReducedUser) => u ? u.NOME || '' : '', 150, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const observacaoColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'OBSERVACAO', null, 200, 500, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "ID_REQUISICAO",
        headerName: "ID",
        width: idColumnWidth,
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
        width: descriptionColumnWidth,
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
        width: projectColumnWidth,
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
        width: requisitanteColumnWidth,
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
        width: gerenteColumnWidth,
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
        width: responsavelProjetoColumnWidth,
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
        field: "comprador",
        headerName: "Comprador",
        width: compradorColumnWidth,
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
        field: "status",
        headerName: "Status",
        width: statusColumnWidth,
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
        width: tipoColumnWidth,
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
        width: 120,
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
    [filters, idColumnWidth, descriptionColumnWidth, projectColumnWidth, requisitanteColumnWidth, gerenteColumnWidth, responsavelProjetoColumnWidth, statusColumnWidth, tipoColumnWidth]
  );

  const secondaryColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "criado_por",
        headerName: "Criado por",
        width: criadoPorColumnWidth,
        valueGetter: (user: ReducedUser) => {
          return user.NOME || '';
        },
      },
      {
        field: "alterado_por",
        headerName: "Alterado por",
        width: alteradoPorColumnWidth,
        valueGetter: (user: ReducedUser) => {
          return user.NOME || '';
        },
      },
      {
        field: "OBSERVACAO",
        headerName: "Observação",
        width: observacaoColumnWidth,
      },
      {
        field: "data_alteracao",
        headerName: "Data de Alteração",
        width: 180,
        type: "date",
        valueGetter: (value) => {
          return getDateFromISOstring(value);
        },
      },
      {
        field: "data_criacao",
        headerName: "Data de Criação",
        width: 180,
        type: "date",
        valueGetter: (value) => {
          return getDateFromISOstring(value);
        },
      },
      {
        field: "gerente",
        headerName: "Gerente",
        width: gerenteColumnWidth,
        valueGetter: (user: ReducedUser) => {
          return user.NOME || '';
        },
      },
    ],
    [criadoPorColumnWidth, alteradoPorColumnWidth, observacaoColumnWidth, gerenteColumnWidth]
  );

  return { columns, secondaryColumns };
}
