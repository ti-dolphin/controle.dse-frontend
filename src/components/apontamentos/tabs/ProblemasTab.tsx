import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setRows as setProblemaRows,
  setSelectedRow as setProblemaSelectedRow,
  setLoading as setProblemaLoading,
  setSearchTerm as setProblemaSearchTerm,
  setFilters as setProblemaFilters,
  clearFilters as clearProblemaFilters,
  setPage as setProblemaPage,
  setPageSize as setProblemaPageSize,
} from "../../../redux/slices/apontamentos/problemaTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import NotesService from "../../../services/NotesService";
import { Box, Button, useTheme, TextField, InputAdornment, FormControlLabel, Checkbox } from "@mui/material";
import { useProblemaColumns } from "../../../hooks/apontamentos/useProblemaColumns";
import BaseDataTable from "../../shared/BaseDataTable";
import BaseDetailModal from "../../shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import { debounce } from "lodash";
import SearchIcon from "@mui/icons-material/Search";
import { Problema } from "../../../models/Problema";

const ProblemasTab: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const gridRefProblema = useGridApiRef();

  const {
    rows: problemaRows,
    loading: problemaLoading,
    selectedRow: problemaSelectedRow,
    searchTerm: problemaSearchTerm,
    filters: problemaFilters,
    page: problemaPage,
    pageSize: problemaPageSize,
  } = useSelector((state: RootState) => state.problemaTable);

  const handleChangeProblemaFilters = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
      const value = e.target.value;
      dispatch(setProblemaFilters({ ...problemaFilters, [field]: value }));
    },
    [dispatch, problemaFilters]
  );

  const handleChangeProblemaCheckbox = useCallback(
    (field: string, checked: boolean) => {
      dispatch(setProblemaFilters({ ...problemaFilters, [field]: checked }));
    },
    [dispatch, problemaFilters]
  );

  const changeProblemaSelectedRow = useCallback(
    (row: Problema | null) => {
      dispatch(setProblemaSelectedRow(row));
    },
    [dispatch]
  );

  const { columns: problemaColumns } = useProblemaColumns(handleChangeProblemaFilters);

  const handleChangeProblemaSearchTerm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setProblemaSearchTerm(event.target.value));
    },
    [dispatch]
  );

  const debouncedHandleChangeProblemaSearchTerm = useMemo(
    () => debounce(handleChangeProblemaSearchTerm, 500),
    [handleChangeProblemaSearchTerm]
  );

  const handleCleanProblemaFilter = useCallback(() => {
    dispatch(clearProblemaFilters());
    dispatch(setProblemaSearchTerm(""));
  }, [dispatch]);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleProblemaPeriodoAtual = useCallback(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dataInicio = new Date(ano, mes, 26);
    const dataFim = new Date(ano, mes + 1, 25);

    dispatch(
      setProblemaFilters({
        ...problemaFilters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  }, [dispatch, problemaFilters]);

  const handleProblemaPeriodoAnterior = useCallback(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dataInicio = new Date(ano, mes - 1, 26);
    const dataFim = new Date(ano, mes, 25);

    dispatch(
      setProblemaFilters({
        ...problemaFilters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  }, [dispatch, problemaFilters]);

  const handleProblemaHoje = useCallback(() => {
    const hoje = formatDate(new Date());
    dispatch(
      setProblemaFilters({
        ...problemaFilters,
        DATA_DE: hoje,
        DATA_ATE: hoje,
      })
    );
  }, [dispatch, problemaFilters]);

  const navigateToProblemaDetails = useCallback(
    (params: any) => {
      if (params.field === "actions") return;
      changeProblemaSelectedRow(params.row);
    },
    [changeProblemaSelectedRow]
  );

  const fetchProblemaData = useCallback(async () => {
    dispatch(setProblemaLoading(true));
    try {
      const data = await NotesService.getManyProblema({
        filters: problemaFilters,
        searchTerm: problemaSearchTerm,
        page: problemaPage,
        pageSize: problemaPageSize,
      });
      dispatch(setProblemaRows(data));
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: e.message || "Houve um erro ao buscar dados de problemas",
          type: "error",
        })
      );
    } finally {
      dispatch(setProblemaLoading(false));
    }
  }, [dispatch, problemaFilters, problemaSearchTerm, problemaPage, problemaPageSize]);

  useEffect(() => {
    fetchProblemaData();
  }, [fetchProblemaData]);

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
          onChange={debouncedHandleChangeProblemaSearchTerm}
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
          value={problemaFilters.DATA_DE}
          onChange={(e) => handleChangeProblemaFilters(e, "DATA_DE")}
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
          value={problemaFilters.DATA_ATE}
          onChange={(e) => handleChangeProblemaFilters(e, "DATA_ATE")}
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
          size="small"
          variant="outlined"
          onClick={handleProblemaHoje}
          sx={{ height: 32, fontSize: 11 }}
        >
          Hoje
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleProblemaPeriodoAtual}
          sx={{ height: 32, fontSize: 11 }}
        >
          Período Atual
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleProblemaPeriodoAnterior}
          sx={{ height: 32, fontSize: 11 }}
        >
          Período Anterior
        </Button>

        <FormControlLabel
          control={
            <Checkbox
              checked={problemaFilters.ATIVOS}
              onChange={(e) => handleChangeProblemaCheckbox("ATIVOS", e.target.checked)}
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
              checked={problemaFilters.COMENTADO}
              onChange={(e) => handleChangeProblemaCheckbox("COMENTADO", e.target.checked)}
              size="small"
            />
          }
          label="Comentados"
          sx={{ "& .MuiFormControlLabel-label": { fontSize: 12 } }}
        />

        <Button
          sx={{ height: 32, borderRadius: 0, fontSize: 12 }}
          variant="contained"
          onClick={handleCleanProblemaFilter}
        >
          Limpar filtros
        </Button>
      </Box>

      <BaseDataTable
        apiRef={gridRefProblema}
        rows={problemaRows}
        disableColumnMenu
        disableColumnFilter
        rowHeight={40}
        columns={problemaColumns}
        loading={problemaLoading}
        onCellClick={(params: { field: string }) =>
          params.field !== "actions" && navigateToProblemaDetails(params)
        }
        getRowId={(row: any) => row.CODAPONT}
        theme={theme}
        paginationMode="server"
        paginationModel={{ page: problemaPage, pageSize: problemaPageSize }}
        onPaginationModelChange={(model: { page: number; pageSize: number }) => {
          dispatch(setProblemaPage(model.page));
          dispatch(setProblemaPageSize(model.pageSize));
        }}
        pageSizeOptions={[25, 50, 100]}
      />

      <BaseDetailModal
        open={problemaSelectedRow !== null}
        onClose={() => dispatch(setProblemaSelectedRow(null))}
        columns={problemaColumns}
        row={problemaSelectedRow}
        ref={gridRefProblema}
      />
    </>
  );
};

export default ProblemasTab;
