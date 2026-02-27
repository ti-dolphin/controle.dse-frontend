import { GridColDef } from "@mui/x-data-grid";
import { useMemo, useCallback } from "react";
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
  const { filters, rows } = useSelector((state: RootState) => state.pontoTable);

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

  const statusColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'DESCRICAO_STATUS', null, 100, 200, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const centroCustoColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'NOME_CENTRO_CUSTO', null, 150, 400, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const liderColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'NOME_LIDER', null, 150, 300, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const motivoColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'MOTIVO_PROBLEMA', null, 200, 500, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const justificadoPorColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'JUSTIFICADO_POR', null, 120, 250, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const justificativaColumnWidth = useMemo(() => 
    calculateOptimalColumnWidth(rows, 'JUSTIFICATIVA', null, 200, 500, 8, 40),
    [rows, calculateOptimalColumnWidth]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "CHAPA",
        headerName: "Chapa",
        width: chapaColumnWidth,
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
        width: funcionarioColumnWidth,
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
        width: statusColumnWidth,
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
        width: centroCustoColumnWidth,
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
        width: liderColumnWidth,
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
        width: motivoColumnWidth,
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
        width: justificadoPorColumnWidth,
        sortable: true,
      },
      {
        field: "JUSTIFICATIVA",
        headerName: "Justificativa",
        width: justificativaColumnWidth,
        sortable: true,
      },
    ],
    [filters, handleChangeFilters, onToggleField, chapaColumnWidth, funcionarioColumnWidth, statusColumnWidth, centroCustoColumnWidth, liderColumnWidth, motivoColumnWidth, justificadoPorColumnWidth, justificativaColumnWidth]
  );

  return { columns };
};
