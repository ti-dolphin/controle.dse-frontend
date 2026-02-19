import { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Checkbox } from "@mui/material";
import { TextHeader } from "../../components/TextHeader";

const formatDate = (value: string | null) => {
  if (!value) return "";
  const [year, month, day] = String(value).split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

const formatDateTime = (value: string | null) => {
  if (!value) return "";
  const [datePart, timePart] = String(value).split("T");
  const [year, month, day] = datePart.split("-");
  if (!timePart) return `${day}/${month}/${year}`;
  const time = timePart.replace("Z", "").split(".")[0];
  return `${day}/${month}/${year} ${time}`;
};

export const usePontoColumns = (
  handleChangeFilters: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void,
  onToggleField?: (codapont: number, field: string, currentValue: boolean) => void
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
        field: "NOME_CENTRO_CUSTO",
        headerName: "Centro de Custo",
        width: 200,
        sortable: true,
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
        field: "NOME_LIDER",
        headerName: "Líder",
        width: 180,
        sortable: true,
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
        field: "VERIFICADO",
        headerName: "Verificado",
        width: 90,
        sortable: true,
        align: "center",
        headerAlign: "center",
        renderCell: (params: any) => (
          <Checkbox
            checked={!!params.value}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleField?.(params.row.CODAPONT, "VERIFICADO", !!params.value);
            }}
            sx={{ padding: 0 }}
          />
        ),
      },
      {
        field: "PROBLEMA",
        headerName: "Problema",
        width: 90,
        sortable: true,
        align: "center",
        headerAlign: "center",
        renderCell: (params: any) => (
          <Checkbox
            checked={!!params.value}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleField?.(params.row.CODAPONT, "PROBLEMA", !!params.value);
            }}
            sx={{ padding: 0 }}
          />
        ),
      },
      {
        field: "AJUSTADO",
        headerName: "Ajustado",
        width: 90,
        sortable: true,
        align: "center",
        headerAlign: "center",
        renderCell: (params: any) => (
          <Checkbox
            checked={!!params.value}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleField?.(params.row.CODAPONT, "AJUSTADO", !!params.value);
            }}
            sx={{ padding: 0 }}
          />
        ),
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
      {
        field: "DATA_HORA_JUSTIFICATIVA",
        headerName: "Data Justificativa",
        width: 150,
        sortable: true,
        valueFormatter: (params: any) => formatDateTime(params),
      },
      {
        field: "JUSTIFICADO_POR",
        headerName: "Justificado por",
        width: 150,
        sortable: true,
      },
      {
        field: "JUSTIFICATIVA",
        headerName: "Justificativa",
        width: 300,
        sortable: true,
      },
    ],
    [filters, handleChangeFilters, onToggleField]
  );

  return { columns };
};
