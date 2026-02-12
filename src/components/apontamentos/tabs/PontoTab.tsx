import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setRows as setPontoRows,
  setSelectedRow as setPontoSelectedRow,
  setLoading as setPontoLoading,
  setSearchTerm as setPontoSearchTerm,
  setFilters as setPontoFilters,
  clearFilters as clearPontoFilters,
  setPage as setPontoPage,
  setPageSize as setPontoPageSize,
} from "../../../redux/slices/apontamentos/pontoTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import NotesService from "../../../services/NotesService";
import { Box, Button, useTheme, TextField, InputAdornment, FormControlLabel, Checkbox } from "@mui/material";
import { usePontoColumns } from "../../../hooks/apontamentos/usePontoColumns";
import BaseDataTable from "../../shared/BaseDataTable";
import BaseDetailModal from "../../shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import { debounce } from "lodash";
import SearchIcon from "@mui/icons-material/Search";
import { Ponto } from "../../../models/Ponto";

const PontoTab: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const gridRefPonto = useGridApiRef();

  const {
    rows: pontoRows,
    loading: pontoLoading,
    selectedRow: pontoSelectedRow,
    searchTerm: pontoSearchTerm,
    filters: pontoFilters,
    page: pontoPage,
    pageSize: pontoPageSize,
  } = useSelector((state: RootState) => state.pontoTable);

  const handleChangePontoFilters = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
      const value = e.target.value;
      dispatch(setPontoFilters({ ...pontoFilters, [field]: value }));
    },
    [dispatch, pontoFilters]
  );

  const handleChangePontoCheckbox = useCallback(
    (field: string, checked: boolean) => {
      dispatch(setPontoFilters({ ...pontoFilters, [field]: checked }));
    },
    [dispatch, pontoFilters]
  );

  const changePontoSelectedRow = useCallback(
    (row: Ponto | null) => {
      dispatch(setPontoSelectedRow(row));
    },
    [dispatch]
  );

  const { columns: pontoColumns } = usePontoColumns(handleChangePontoFilters);

  const handleChangePontoSearchTerm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPontoSearchTerm(event.target.value));
    },
    [dispatch]
  );

  const debouncedHandleChangePontoSearchTerm = useMemo(
    () => debounce(handleChangePontoSearchTerm, 500),
    [handleChangePontoSearchTerm]
  );

  const handleCleanPontoFilter = useCallback(() => {
    dispatch(clearPontoFilters());
    dispatch(setPontoSearchTerm(""));
  }, [dispatch]);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handlePontoPeriodoAtual = useCallback(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dataInicio = new Date(ano, mes, 26);
    const dataFim = new Date(ano, mes + 1, 25);

    dispatch(
      setPontoFilters({
        ...pontoFilters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  }, [dispatch, pontoFilters]);

  const handlePontoPeriodoAnterior = useCallback(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dataInicio = new Date(ano, mes - 1, 26);
    const dataFim = new Date(ano, mes, 25);

    dispatch(
      setPontoFilters({
        ...pontoFilters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  }, [dispatch, pontoFilters]);

  const handlePontoHoje = useCallback(() => {
    const hoje = formatDate(new Date());
    dispatch(
      setPontoFilters({
        ...pontoFilters,
        DATA_DE: hoje,
        DATA_ATE: hoje,
      })
    );
  }, [dispatch, pontoFilters]);

  const navigateToPontoDetails = useCallback(
    (params: any) => {
      if (params.field === "actions") return;
      changePontoSelectedRow(params.row);
    },
    [changePontoSelectedRow]
  );

  const fetchPontoData = useCallback(async () => {
    dispatch(setPontoLoading(true));
    try {
      const data = await NotesService.getManyPonto({
        filters: pontoFilters,
        searchTerm: pontoSearchTerm,
        page: pontoPage,
        pageSize: pontoPageSize,
      });
      dispatch(setPontoRows(data));
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: e.message || "Houve um erro ao buscar dados de ponto",
          type: "error",
        })
      );
    } finally {
      dispatch(setPontoLoading(false));
    }
  }, [dispatch, pontoFilters, pontoSearchTerm, pontoPage, pontoPageSize]);

  useEffect(() => {
    fetchPontoData();
  }, [fetchPontoData]);

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
          onChange={debouncedHandleChangePontoSearchTerm}
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
          value={pontoFilters.DATA_DE}
          onChange={(e) => handleChangePontoFilters(e, "DATA_DE")}
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
          value={pontoFilters.DATA_ATE}
          onChange={(e) => handleChangePontoFilters(e, "DATA_ATE")}
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
          onClick={handlePontoHoje}
        >
          Hoje
        </Button>
        <Button
          sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
          variant="outlined"
          onClick={handlePontoPeriodoAtual}
        >
          Período atual
        </Button>
        <Button
          sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
          variant="outlined"
          onClick={handlePontoPeriodoAnterior}
        >
          Período anterior
        </Button>

        <FormControlLabel
          control={
            <Checkbox
              checked={pontoFilters.ATIVOS}
              onChange={(e) => handleChangePontoCheckbox("ATIVOS", e.target.checked)}
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
              checked={pontoFilters.PROBLEMA}
              onChange={(e) => handleChangePontoCheckbox("PROBLEMA", e.target.checked)}
              size="small"
            />
          }
          label="Com Problema"
          sx={{ "& .MuiFormControlLabel-label": { fontSize: 12 } }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={pontoFilters.AJUSTADO}
              onChange={(e) => handleChangePontoCheckbox("AJUSTADO", e.target.checked)}
              size="small"
            />
          }
          label="Ajustado"
          sx={{ "& .MuiFormControlLabel-label": { fontSize: 12 } }}
        />

        <Button
          sx={{ height: 32, borderRadius: 0, fontSize: 12 }}
          variant="contained"
          onClick={handleCleanPontoFilter}
        >
          Limpar filtros
        </Button>
      </Box>

      <BaseDataTable
        apiRef={gridRefPonto}
        rows={pontoRows}
        disableColumnMenu
        disableColumnFilter
        rowHeight={40}
        columns={pontoColumns}
        loading={pontoLoading}
        onCellClick={(params: { field: string }) =>
          params.field !== "actions" && navigateToPontoDetails(params)
        }
        getRowId={(row: any) => row.CODAPONT}
        theme={theme}
        paginationMode="server"
        paginationModel={{ page: pontoPage, pageSize: pontoPageSize }}
        onPaginationModelChange={(model: { page: number; pageSize: number }) => {
          dispatch(setPontoPage(model.page));
          dispatch(setPontoPageSize(model.pageSize));
        }}
        pageSizeOptions={[25, 50, 100]}
      />

      <BaseDetailModal
        open={pontoSelectedRow !== null}
        onClose={() => dispatch(setPontoSelectedRow(null))}
        columns={pontoColumns}
        row={pontoSelectedRow}
        ref={gridRefPonto}
      />
    </>
  );
};

export default PontoTab;
