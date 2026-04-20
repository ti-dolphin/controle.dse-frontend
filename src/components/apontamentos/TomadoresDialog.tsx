import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  useTheme,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useGridApiRef, GridColDef } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import BaseDataTable from "../shared/BaseDataTable";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import NotesService from "../../services/NotesService";
import { Tomador } from "../../models/Tomador";
import { exportToExcel, formatTomadoresForExcel } from "../../utils/excelExport";

interface TomadoresDialogProps {
  open: boolean;
  onClose: () => void;
}

interface TomadoresFiltersForm {
  NOME_FUNCIONARIO: string;
  NOME_CENTRO_CUSTO: string;
  CODCCUSTO: string;
  CODLIDER: string;
  DATA_DE: string;
  DATA_ATE: string;
  ATIVOS: boolean;
  searchTerm: string;
}

const initialFilters: TomadoresFiltersForm = {
  NOME_FUNCIONARIO: "",
  NOME_CENTRO_CUSTO: "",
  CODCCUSTO: "",
  CODLIDER: "",
  DATA_DE: "",
  DATA_ATE: "",
  ATIVOS: true,
  searchTerm: "",
};

const TomadoresDialog: React.FC<TomadoresDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const gridRef = useGridApiRef();

  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [rows, setRows] = useState<Tomador[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<TomadoresFiltersForm>(initialFilters);
  const [appliedQuery, setAppliedQuery] = useState<TomadoresFiltersForm>(initialFilters);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "CHAPA", headerName: "Chapa", width: 100 },
      { field: "NOME_FUNCIONARIO", headerName: "Funcionário", flex: 1, minWidth: 220 },
      { field: "NOME_CENTRO_CUSTO", headerName: "Centro de Custo", flex: 1, minWidth: 220 },
      { field: "CODREDUZIDO", headerName: "Cód. Reduzido", width: 130 },
      { field: "QUANTIDADE_DIAS", headerName: "Qtd. Dias", width: 120, type: "number" },
      {
        field: "PERCENTUAL_DIAS",
        headerName: "% Dedicação",
        width: 130,
        type: "number",
        valueFormatter: (value) => `${Number(value ?? 0).toFixed(2)}%`,
      },
    ],
    []
  );

  const fetchTomadores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await NotesService.getTomadores({
        filters: {
          NOME_FUNCIONARIO: appliedQuery.NOME_FUNCIONARIO,
          NOME_CENTRO_CUSTO: appliedQuery.NOME_CENTRO_CUSTO,
          CODCCUSTO: appliedQuery.CODCCUSTO,
          CODLIDER: appliedQuery.CODLIDER,
          DATA_DE: appliedQuery.DATA_DE,
          DATA_ATE: appliedQuery.DATA_ATE,
          ATIVOS: appliedQuery.ATIVOS,
        },
        searchTerm: appliedQuery.searchTerm,
        page,
        pageSize,
      });

      setRows(Array.isArray(response?.data) ? response.data : []);
      setTotalRows(Number(response?.total ?? 0));
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: e.message || "Houve um erro ao buscar relatório de tomadores",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, appliedQuery, page, pageSize]);

  const handleSearch = useCallback(() => {
    setPage(0);
    setAppliedQuery({ ...filters });
  }, [filters]);

  const handleClear = useCallback(() => {
    setFilters(initialFilters);
    setPage(0);
    setAppliedQuery(initialFilters);
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await NotesService.getTomadores({
        filters: {
          NOME_FUNCIONARIO: appliedQuery.NOME_FUNCIONARIO,
          NOME_CENTRO_CUSTO: appliedQuery.NOME_CENTRO_CUSTO,
          CODCCUSTO: appliedQuery.CODCCUSTO,
          CODLIDER: appliedQuery.CODLIDER,
          DATA_DE: appliedQuery.DATA_DE,
          DATA_ATE: appliedQuery.DATA_ATE,
          ATIVOS: appliedQuery.ATIVOS,
        },
        searchTerm: appliedQuery.searchTerm,
        all: true,
      });

      const data = Array.isArray(response?.data) ? response.data : [];
      if (data.length === 0) {
        dispatch(
          setFeedback({
            message: "Não há dados para exportar com os filtros aplicados",
            type: "error",
          })
        );
        return;
      }

      const formattedData = formatTomadoresForExcel(data);
      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, "0")}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getFullYear()}`;
      exportToExcel(formattedData, `Relatorio_Tomadores_${dateStr}`, "Tomadores");

      dispatch(
        setFeedback({
          message: `${data.length} registros exportados com sucesso`,
          type: "success",
        })
      );
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: e.message || "Houve um erro ao exportar relatório de tomadores",
          type: "error",
        })
      );
    } finally {
      setIsExporting(false);
    }
  }, [dispatch, appliedQuery]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    setPage(0);
    setAppliedQuery({ ...filters });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    fetchTomadores();
  }, [open, fetchTomadores]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>Relatório de Tomadores</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
            gap: 1,
            mt: 0.5,
          }}
        >
          <TextField
            size="small"
            label="Busca geral"
            value={filters.searchTerm}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
          />
          <TextField
            size="small"
            label="Funcionário"
            value={filters.NOME_FUNCIONARIO}
            onChange={(e) => setFilters((prev) => ({ ...prev, NOME_FUNCIONARIO: e.target.value }))}
          />
          <TextField
            size="small"
            label="Centro de custo"
            value={filters.NOME_CENTRO_CUSTO}
            onChange={(e) => setFilters((prev) => ({ ...prev, NOME_CENTRO_CUSTO: e.target.value }))}
          />
          <TextField
            size="small"
            label="Código centro de custo"
            value={filters.CODCCUSTO}
            onChange={(e) => setFilters((prev) => ({ ...prev, CODCCUSTO: e.target.value }))}
          />
          <TextField
            size="small"
            label="Código líder"
            value={filters.CODLIDER}
            onChange={(e) => setFilters((prev) => ({ ...prev, CODLIDER: e.target.value }))}
          />
          <TextField
            size="small"
            label="Data de"
            type="date"
            value={filters.DATA_DE}
            onChange={(e) => setFilters((prev) => ({ ...prev, DATA_DE: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            label="Data até"
            type="date"
            value={filters.DATA_ATE}
            onChange={(e) => setFilters((prev) => ({ ...prev, DATA_ATE: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.ATIVOS}
                  onChange={(e) => setFilters((prev) => ({ ...prev, ATIVOS: e.target.checked }))}
                  size="small"
                />
              }
              label="Somente ativos"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: 12 } }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button variant="contained" size="small" onClick={handleSearch} disabled={loading}>
            Buscar
          </Button>
          <Button variant="contained" size="small" onClick={handleClear} disabled={loading}>
            Limpar
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleExport}
            disabled={loading || isExporting}
            startIcon={
              isExporting ? <CircularProgress size={14} color="inherit" /> : <FileDownloadIcon fontSize="small" />
            }
          >
            {isExporting ? "Exportando..." : "Exportar Excel"}
          </Button>
        </Box>

        <Box sx={{ mt: 1, height: 420 }}>
          <BaseDataTable
            apiRef={gridRef}
            rows={rows}
            disableColumnMenu
            disableColumnFilter
            rowHeight={34}
            columns={columns}
            loading={loading}
            getRowId={(row: Tomador) => `${row.CHAPA}-${row.CODREDUZIDO}-${row.NOME_CENTRO_CUSTO}`}
            theme={theme}
            paginationMode="server"
            rowCount={totalRows}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(model: { page: number; pageSize: number }) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            pageSizeOptions={[25, 50, 100]}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TomadoresDialog;
