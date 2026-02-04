import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  setRows,
  setSelectedRow,
  setLoading,
  setSearchTerm,
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
} from "../../redux/slices/apontamentos/notesTableSlice";
import {
  setRows as setPontoRows,
  setSelectedRow as setPontoSelectedRow,
  setLoading as setPontoLoading,
  setSearchTerm as setPontoSearchTerm,
  setFilters as setPontoFilters,
  clearFilters as clearPontoFilters,
  setPage as setPontoPage,
  setPageSize as setPontoPageSize,
} from "../../redux/slices/apontamentos/pontoTableSlice";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import NotesService from "../../services/NotesService";
import { Box, Button, useTheme, TextField, InputAdornment, FormControlLabel, Checkbox, Tabs, Tab } from "@mui/material";
import { useNotesColumns } from "../../hooks/apontamentos/useNotesColumns";
import { usePontoColumns } from "../../hooks/apontamentos/usePontoColumns";
import BaseDataTable from "../../components/shared/BaseDataTable";
import BaseDetailModal from "../../components/shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import BaseToolBar from "../../components/shared/BaseToolBar";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import UpperNavigation from "../../components/shared/UpperNavigation";
import SearchIcon from "@mui/icons-material/Search";
import { Note } from "../../models/Note";
import { Ponto } from "../../models/Ponto";

const NotesHomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const gridRef = useGridApiRef();
  const gridRefPonto = useGridApiRef();
  const [activeTab, setActiveTab] = useState(0);

  // State Apontamentos
  const { rows, loading, selectedRow, searchTerm, filters, page, pageSize } =
    useSelector((state: RootState) => state.notesTable);

  // State Ponto
  const { 
    rows: pontoRows, 
    loading: pontoLoading, 
    selectedRow: pontoSelectedRow, 
    searchTerm: pontoSearchTerm, 
    filters: pontoFilters, 
    page: pontoPage, 
    pageSize: pontoPageSize 
  } = useSelector((state: RootState) => state.pontoTable);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // ==================== APONTAMENTOS ====================
  const handleChangeFilters = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: string
    ) => {
      let value: any = e.target.value;
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

  const changeSelectedRow = (row: Note | null) => {
    dispatch(setSelectedRow(row));
  };

  const { columns } = useNotesColumns(handleChangeFilters);

  const handleChangeSearchTerm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      dispatch(setSearchTerm(value));
    },
    [dispatch]
  );

  const debouncedHandleChangeSearchTerm = useMemo(() => {
    return debounce(handleChangeSearchTerm, 500);
  }, [handleChangeSearchTerm]);

  const handleCleanFilter = () => {
    dispatch(clearFilters());
    dispatch(setSearchTerm(""));
  };

  // ==================== PONTO ====================
  const handleChangePontoFilters = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: string
    ) => {
      let value: any = e.target.value;
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

  const changePontoSelectedRow = (row: Ponto | null) => {
    dispatch(setPontoSelectedRow(row));
  };

  const { columns: pontoColumns } = usePontoColumns(handleChangePontoFilters);

  const handleChangePontoSearchTerm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      dispatch(setPontoSearchTerm(value));
    },
    [dispatch]
  );

  const debouncedHandleChangePontoSearchTerm = useMemo(() => {
    return debounce(handleChangePontoSearchTerm, 500);
  }, [handleChangePontoSearchTerm]);

  const handleCleanPontoFilter = () => {
    dispatch(clearPontoFilters());
    dispatch(setPontoSearchTerm(""));
  };

  const navigateToPontoDetails = (params: any) => {
    if (params.field === "actions") return;
    changePontoSelectedRow(params.row);
  };

  // Funções para calcular períodos
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const handlePeriodoAtual = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth(); // 0-indexed

    // Período atual: 26/mês atual até 25/próximo mês
    const dataInicio = new Date(ano, mes, 26);
    const dataFim = new Date(ano, mes + 1, 25);

    dispatch(
      setFilters({
        ...filters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  };

  const handlePeriodoAnterior = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth(); // 0-indexed

    // Período anterior: 26/mês anterior até 25/mês atual
    const dataInicio = new Date(ano, mes - 1, 26);
    const dataFim = new Date(ano, mes, 25);

    dispatch(
      setFilters({
        ...filters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  };

  const handleHoje = () => {
    const hoje = formatDate(new Date());
    dispatch(
      setFilters({
        ...filters,
        DATA_DE: hoje,
        DATA_ATE: hoje,
      })
    );
  };

  // Períodos para Ponto
  const handlePontoPeriodoAtual = () => {
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
  };

  const handlePontoPeriodoAnterior = () => {
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
  };

  const handlePontoHoje = () => {
    const hoje = formatDate(new Date());
    dispatch(
      setPontoFilters({
        ...pontoFilters,
        DATA_DE: hoje,
        DATA_ATE: hoje,
      })
    );
  };

  const handleBack = () => {
    navigate("/");
  };

  const navigateToNoteDetails = (params: any) => {
    if (params.field === "actions") return;
    // Para visualização detalhada, pode abrir modal ou navegar
    changeSelectedRow(params.row);
  };

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
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchPontoData();
    }
  }, [fetchPontoData, activeTab]);

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <UpperNavigation handleBack={handleBack} />
      <Box
        sx={{
          height: "calc(100% - 40px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BaseToolBar transparent={false}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
                textTransform: "uppercase",
              }}
            >
              Apontamentos
            </Box>
          </Box>
        </BaseToolBar>

        {/* Abas */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'white' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              minHeight: 36,
              "& .MuiTab-root": {
                minHeight: 36,
                fontSize: 12,
                textTransform: "none",
                fontWeight: "bold",
              },
            }}
          >
            <Tab label="Apontamento" />
            <Tab label="Ponto" />
            <Tab label="Problemas" />
          </Tabs>
        </Box>

        {/* Aba Apontamento */}
        {activeTab === 0 && (
          <>
            {/* Barra de pesquisa e filtros */}
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
            marginTop: "5px"
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

          {/* Filtros de Data */}
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

          {/* Botões de Período */}
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

          {/* Checkboxes de filtros */}
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
              "& .MuiFormControlLabel-label": { fontSize: 12 } 
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
        </Box>

        <BaseDataTable
          apiRef={gridRef}
          rows={rows}
          disableColumnMenu
          disableColumnFilter
          rowHeight={40}
          columns={columns}
          loading={loading}
          onCellClick={(params: { field: string }) =>
            params.field !== "actions" && navigateToNoteDetails(params)
          }
          getRowId={(row: any) => row.CODAPONT}
          theme={theme}
          paginationMode="server"
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model: { page: number; pageSize: number }) => {
            dispatch(setPage(model.page));
            dispatch(setPageSize(model.pageSize));
          }}
          pageSizeOptions={[25, 50, 100]}
        />
          </>
        )}

        {/* Aba Ponto */}
        {activeTab === 1 && (
          <>
            {/* Barra de pesquisa e filtros - Ponto */}
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
                marginTop: "5px"
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

              {/* Filtros de Data */}
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

              {/* Botões de Período */}
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

              {/* Checkboxes de filtros */}
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
                  "& .MuiFormControlLabel-label": { fontSize: 12 } 
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
          </>
        )}

        {/* Aba Problemas */}
        {activeTab === 2 && (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <Box sx={{ textAlign: 'center', color: 'gray' }}>
              <Box sx={{ fontSize: 18, fontWeight: 'bold', mb: 1 }}>Problemas</Box>
              <Box sx={{ fontSize: 14 }}>Em desenvolvimento...</Box>
            </Box>
          </Box>
        )}
      </Box>

      <BaseDetailModal
        open={selectedRow !== null}
        onClose={() => dispatch(setSelectedRow(null))}
        columns={columns}
        row={selectedRow}
        ref={gridRef}
      />

      <BaseDetailModal
        open={pontoSelectedRow !== null}
        onClose={() => dispatch(setPontoSelectedRow(null))}
        columns={pontoColumns}
        row={pontoSelectedRow}
        ref={gridRefPonto}
      />
    </Box>
  );
};

export default NotesHomePage;
