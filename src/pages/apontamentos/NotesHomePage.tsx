import React, { useEffect, useMemo, useCallback } from "react";
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
import { setFeedback } from "../../redux/slices/feedBackSlice";
import NotesService from "../../services/NotesService";
import { Box, Button, useTheme, TextField, InputAdornment } from "@mui/material";
import { useNotesColumns } from "../../hooks/apontamentos/useNotesColumns";
import BaseDataTable from "../../components/shared/BaseDataTable";
import BaseDetailModal from "../../components/shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import BaseToolBar from "../../components/shared/BaseToolBar";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import UpperNavigation from "../../components/shared/UpperNavigation";
import SearchIcon from "@mui/icons-material/Search";
import { Note } from "../../models/Note";

const NotesHomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const gridRef = useGridApiRef();

  const { rows, loading, selectedRow, searchTerm, filters, page, pageSize } =
    useSelector((state: RootState) => state.notesTable);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar..."
            onChange={debouncedHandleChangeSearchTerm}
            sx={{
              width: 250,
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
      </Box>

      <BaseDetailModal
        open={selectedRow !== null}
        onClose={() => dispatch(setSelectedRow(null))}
        columns={columns}
        row={selectedRow}
        ref={gridRef}
      />
    </Box>
  );
};

export default NotesHomePage;
