import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setRows,
  setLoading,
  setSearchTerm,
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
} from "../../../redux/slices/apontamentos/notesTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import NotesService from "../../../services/NotesService";
import { Box, Button, useTheme, TextField, InputAdornment, FormControlLabel, Checkbox } from "@mui/material";
import { useNotesColumns } from "../../../hooks/apontamentos/useNotesColumns";
import BaseDataTable from "../../shared/BaseDataTable";
import { useGridApiRef, GridRowSelectionModel } from "@mui/x-data-grid";
import { debounce } from "lodash";
import SearchIcon from "@mui/icons-material/Search";

interface ApontamentosTabProps {
  selectedApontamentos: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onApontarClick: () => void;
}

const ApontamentosTab: React.FC<ApontamentosTabProps> = ({
  selectedApontamentos,
  onSelectionChange,
  onApontarClick,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const gridRef = useGridApiRef();

  const { rows, loading, searchTerm, filters, page, pageSize } = useSelector(
    (state: RootState) => state.notesTable
  );

  const handleChangeFilters = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
      const value = e.target.value;
      dispatch(setFilters({ ...filters, [field]: value }));
    },
    [dispatch, filters]
  );

  const handleChangeCheckbox = useCallback(
    (field: string, checked: boolean) => {
      dispatch(setFilters({ ...filters, [field]: checked }));
    },
    [dispatch, filters]
  );

  const { columns } = useNotesColumns(handleChangeFilters);

  const handleChangeSearchTerm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(event.target.value));
    },
    [dispatch]
  );

  const debouncedHandleChangeSearchTerm = useMemo(
    () => debounce(handleChangeSearchTerm, 500),
    [handleChangeSearchTerm]
  );

  const handleCleanFilter = useCallback(() => {
    dispatch(clearFilters());
    dispatch(setSearchTerm(""));
  }, [dispatch]);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handlePeriodoAtual = useCallback(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dataInicio = new Date(ano, mes, 26);
    const dataFim = new Date(ano, mes + 1, 25);

    dispatch(
      setFilters({
        ...filters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  }, [dispatch, filters]);

  const handlePeriodoAnterior = useCallback(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dataInicio = new Date(ano, mes - 1, 26);
    const dataFim = new Date(ano, mes, 25);

    dispatch(
      setFilters({
        ...filters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  }, [dispatch, filters]);

  const handleHoje = useCallback(() => {
    const hoje = formatDate(new Date());
    dispatch(
      setFilters({
        ...filters,
        DATA_DE: hoje,
        DATA_ATE: hoje,
      })
    );
  }, [dispatch, filters]);

  const handleRowClickApontamento = useCallback(
    (params: any) => {
      if (params.field === "actions" || params.field === "__check__") return;

      const rowId = params.row.CODAPONT;
      const isSelected = selectedApontamentos.includes(rowId);

      if (isSelected) {
        onSelectionChange(selectedApontamentos.filter((id) => id !== rowId));
      } else {
        onSelectionChange([...selectedApontamentos, rowId]);
      }
    },
    [selectedApontamentos, onSelectionChange]
  );

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await NotesService.getMany({
        filters,
        searchTerm,
        page,
        pageSize,
      });
      dispatch(setRows(data));
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: e.message || "Houve um erro ao buscar apontamentos",
          type: "error",
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters, searchTerm, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          padding: 0.5,
          backgroundColor: "white",
          borderRadius: "0",
          border: "1px solid lightgray",
          marginTop: "5px",
        }}
      >
        <TextField
          size="small"
          placeholder="Buscar..."
          onChange={debouncedHandleChangeSearchTerm}
          sx={{
            width: 200,
            "& .MuiOutlinedInput-root": {
              height: 32,
              fontSize: 12,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          label="De"
          type="date"
          value={filters.DATA_DE}
          onChange={(e) => handleChangeFilters(e, "DATA_DE")}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: 150,
            "& .MuiOutlinedInput-root": {
              height: 32,
              fontSize: 12,
            },
            "& .MuiInputLabel-root": {
              fontSize: 12,
            },
          }}
        />
        <TextField
          size="small"
          label="Até"
          type="date"
          value={filters.DATA_ATE}
          onChange={(e) => handleChangeFilters(e, "DATA_ATE")}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: 150,
            "& .MuiOutlinedInput-root": {
              height: 32,
              fontSize: 12,
            },
            "& .MuiInputLabel-root": {
              fontSize: 12,
            },
          }}
        />

        <Button
          sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
          variant="outlined"
          onClick={handleHoje}
        >
          Hoje
        </Button>
        <Button
          sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
          variant="outlined"
          onClick={handlePeriodoAtual}
        >
          Período atual
        </Button>
        <Button
          sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
          variant="outlined"
          onClick={handlePeriodoAnterior}
        >
          Período anterior
        </Button>

        <FormControlLabel
          control={
            <Checkbox
              checked={filters.ATIVOS}
              onChange={(e) => handleChangeCheckbox("ATIVOS", e.target.checked)}
              size="small"
            />
          }
          label="Ativos"
          sx={{
            marginLeft: 1,
            "& .MuiFormControlLabel-label": { fontSize: 12 },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.COMENTADOS}
              onChange={(e) => handleChangeCheckbox("COMENTADOS", e.target.checked)}
              size="small"
            />
          }
          label="Comentados"
          sx={{ "& .MuiFormControlLabel-label": { fontSize: 12 } }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.SEM_ASSIDUIDADE}
              onChange={(e) => handleChangeCheckbox("SEM_ASSIDUIDADE", e.target.checked)}
              size="small"
            />
          }
          label="Sem Assiduidade"
          sx={{ "& .MuiFormControlLabel-label": { fontSize: 12 } }}
        />

        <Button
          sx={{ height: 32, borderRadius: 0, fontSize: 12 }}
          variant="contained"
          onClick={handleCleanFilter}
        >
          Limpar filtros
        </Button>

        <Button
          sx={{ height: 32, borderRadius: 0, fontSize: 12, marginLeft: "auto" }}
          variant="contained"
          color="primary"
          disabled={selectedApontamentos.length === 0}
          onClick={onApontarClick}
        >
          Apontar ({selectedApontamentos.length})
        </Button>
      </Box>

      <BaseDataTable
        apiRef={gridRef}
        rows={rows}
        disableColumnMenu
        disableColumnFilter
        rowHeight={40}
        columns={columns}
        loading={loading}
        checkboxSelection
        rowSelectionModel={selectedApontamentos}
        onRowSelectionModelChange={onSelectionChange}
        onCellClick={handleRowClickApontamento}
        getRowId={(row: any) => row.CODAPONT}
        theme={theme}
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model: { page: number; pageSize: number }) => {
          dispatch(setPage(model.page));
          dispatch(setPageSize(model.pageSize));
        }}
        pageSizeOptions={[25, 50, 100]}
        sx={{
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: theme.palette.primary.main + "30 !important",
          },
          "& .MuiDataGrid-row.Mui-selected:hover": {
            backgroundColor: theme.palette.primary.main + "40 !important",
          },
        }}
      />
    </>
  );
};

export default ApontamentosTab;
