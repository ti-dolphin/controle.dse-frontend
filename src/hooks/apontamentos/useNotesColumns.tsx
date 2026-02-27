import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { TextHeader } from "../../components/TextHeader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CommentIcon from "@mui/icons-material/Comment";

const getWeekDay = (dateString: string): string => {
  if (!dateString) return "-";
  const [year, month, day] = String(dateString).split("T")[0].split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const days = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  return days[date.getDay()];
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  const [year, month, day] = String(dateString).split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

const getSituacaoLabel = (situacao: string): string => {
  switch (situacao) {
    case "A":
      return "Ativo";
    case "I":
      return "Inativo";
    case "P":
      return "Pendente";
    case "Z":
      return "Zerado";
    default:
      return situacao || "-";
  }
};

export function useNotesColumns(
  handleChangeFilters: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void,
  onCommentClick?: (codapont: number) => void
) {
  const { filters, rows } = useSelector((state: RootState) => state.notesTable);

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
  const chapaColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'CHAPA', null, 70, 120, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const funcionarioColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'NOME_FUNCIONARIO', null, 180, 400, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const funcaoColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'NOME_FUNCAO', null, 150, 350, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const gerenteColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'NOME_GERENTE', null, 120, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const centroCustoColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'NOME_CENTRO_CUSTO', null, 150, 400, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const codReduzidoColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'CODREDUZIDO', null, 80, 150, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const statusColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'DESCRICAO_STATUS', null, 100, 200, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const liderColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'NOME_LIDER', null, 120, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const modificadoPorColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'MODIFICADOPOR', null, 120, 250, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "PONTO",
        headerName: "Ponto",
        width: 70,
        align: "center",
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
          params.value ? 
            <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} /> : 
            <CancelIcon sx={{ color: "red", fontSize: 18 }} />
        ),
      },
      {
        field: "ASSIDUIDADE",
        headerName: "Assiduidade",
        width: 90,
        align: "center",
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
          params.value ? 
            <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} /> : 
            <CancelIcon sx={{ color: "red", fontSize: 18 }} />
        ),
      },
      {
        field: "COMENTADO",
        headerName: "Comentado",
        width: 90,
        align: "center",
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
          params.value ? 
            <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} /> : 
            <CancelIcon sx={{ color: "gray", fontSize: 18 }} />
        ),
      },
      {
        field: "CHAPA",
        headerName: "Chapa",
        width: chapaColumnWidth,
        renderHeader: () => (
          <TextHeader
            label="Chapa"
            field="CHAPA"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "NOME_FUNCIONARIO",
        headerName: "Funcionário",
        width: funcionarioColumnWidth,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
            <Typography fontSize="11px" fontWeight="bold">
              {params.value || "-"}
            </Typography>
          </Box>
        ),
        renderHeader: () => (
          <TextHeader
            label="Funcionário"
            field="NOME_FUNCIONARIO"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "NOME_FUNCAO",
        headerName: "Função",
        width: funcaoColumnWidth,
        renderHeader: () => (
          <TextHeader
            label="Função"
            field="NOME_FUNCAO"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "DATA",
        headerName: "Data",
        width: 100,
        valueGetter: (value: string) => formatDate(value),
      },
      {
        field: "DIA_SEMANA",
        headerName: "Dia da Semana",
        width: 120,
        valueGetter: (_value: any, row: any) => getWeekDay(row.DATA),
      },
      {
        field: "NOME_GERENTE",
        headerName: "Gerente",
        width: gerenteColumnWidth,
        renderHeader: () => (
          <TextHeader
            label="Gerente"
            field="NOME_GERENTE"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "NOME_CENTRO_CUSTO",
        headerName: "Centro de Custo",
        width: centroCustoColumnWidth,
        renderHeader: () => (
          <TextHeader
            label="Centro de Custo"
            field="NOME_CENTRO_CUSTO"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "CODREDUZIDO",
        headerName: "CNO (CEI)",
        width: codReduzidoColumnWidth,
      },
      {
        field: "DESCRICAO_STATUS",
        headerName: "Status",
        width: statusColumnWidth,
        renderHeader: () => (
          <TextHeader
            label="Status"
            field="DESCRICAO_STATUS"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "NOME_LIDER",
        headerName: "Líder",
        width: liderColumnWidth,
        renderHeader: () => (
          <TextHeader
            label="Líder"
            field="NOME_LIDER"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "CODSITUACAO",
        headerName: "Situação",
        width: 80,
        align: "center",
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
          <Chip 
            label={getSituacaoLabel(params.value)} 
            size="small"
            color={params.value === "A" ? "success" : params.value === "I" ? "error" : "default"}
            sx={{ fontSize: 10 }}
          />
        ),
      },
      {
        field: "MODIFICADOPOR",
        headerName: "Modificado",
        width: modificadoPorColumnWidth,
      },
      {
        field: "actions",
        headerName: "Ações",
        width: 80,
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => (
          <Tooltip title="Comentários">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onCommentClick?.(params.row.CODAPONT);
              }}
              sx={{ 
                color: params.row.COMENTADO ? "primary.main" : "text.secondary",
              }}
            >
              <CommentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [filters, handleChangeFilters, onCommentClick, chapaColumnWidth, funcionarioColumnWidth, funcaoColumnWidth, gerenteColumnWidth, centroCustoColumnWidth, codReduzidoColumnWidth, statusColumnWidth, liderColumnWidth, modificadoPorColumnWidth]
  );

  return { columns };
}
