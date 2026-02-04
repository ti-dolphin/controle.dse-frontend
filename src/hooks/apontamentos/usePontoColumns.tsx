import { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { TextHeader } from "../../components/TextHeader";

const formatDate = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
};

const formatDateTime = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleString("pt-BR");
};

const BooleanCell = ({ value }: { value: boolean }) => {
  return value ? (
    <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />
  ) : (
    <CancelIcon sx={{ color: "red", fontSize: 18 }} />
  );
};

export const usePontoColumns = (
  handleChangeFilters: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void
) => {
  const { filters } = useSelector((state: RootState) => state.pontoTable);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "CHAPA",
        headerName: "Chapa",
        width: 80,
        sortable: true,
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
        headerName: "Nome",
        width: 250,
        sortable: true,
        renderHeader: () => (
          <TextHeader
            label="Nome"
            field="NOME_FUNCIONARIO"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "DATA",
        headerName: "Data",
        width: 100,
        sortable: true,
        valueFormatter: (params: any) => formatDate(params),
      },
      {
        field: "DESCRICAO_STATUS",
        headerName: "Status",
        width: 120,
        sortable: true,
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
        field: "VERIFICADO",
        headerName: "Verificado",
        width: 90,
        sortable: true,
        align: "center",
        headerAlign: "center",
        renderCell: (params: any) => <BooleanCell value={params.value} />,
      },
      {
        field: "PROBLEMA",
        headerName: "Problema",
        width: 90,
        sortable: true,
        align: "center",
        headerAlign: "center",
        renderCell: (params: any) => <BooleanCell value={params.value} />,
      },
      {
        field: "AJUSTADO",
        headerName: "Ajustado",
        width: 90,
        sortable: true,
        align: "center",
        headerAlign: "center",
        renderCell: (params: any) => <BooleanCell value={params.value} />,
      },
      {
        field: "DATA_HORA_MOTIVO",
        headerName: "Data Motivo",
        width: 150,
        sortable: true,
        valueFormatter: (params: any) => formatDateTime(params),
      },
      {
        field: "MOTIVO_PROBLEMA",
        headerName: "Motivo",
        width: 300,
        sortable: true,
        renderHeader: () => (
          <TextHeader
            label="Motivo"
            field="MOTIVO_PROBLEMA"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
    ],
    [filters, handleChangeFilters]
  );

  return { columns };
};
