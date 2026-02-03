import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Typography, Chip } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { TextHeader } from "../../components/TextHeader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const getWeekDay = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const days = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  return days[date.getDay()];
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR");
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
  handleChangeFilters: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void
) {
  const { filters } = useSelector((state: RootState) => state.notesTable);

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
        field: "BANCO_HORAS",
        headerName: "Banco Hrs",
        width: 90,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "CHAPA",
        headerName: "Chapa",
        width: 80,
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
        flex: 1.5,
        minWidth: 180,
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
        flex: 1,
        minWidth: 150,
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
        flex: 1,
        minWidth: 120,
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
        flex: 1,
        minWidth: 150,
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
        width: 100,
      },
      {
        field: "DESCRICAO_STATUS",
        headerName: "Status",
        width: 100,
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
        flex: 1,
        minWidth: 120,
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
        field: "ATIVIDADE",
        headerName: "Atividade",
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Typography fontSize="11px" noWrap title={params.value || ""}>
            {params.value ? (params.value.length > 30 ? params.value.substring(0, 30) + "..." : params.value) : "-"}
          </Typography>
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
        width: 120,
      },
      {
        field: "CODOS",
        headerName: "N° OS/Tar.",
        width: 90,
      },
    ],
    [filters, handleChangeFilters]
  );

  return { columns };
}
