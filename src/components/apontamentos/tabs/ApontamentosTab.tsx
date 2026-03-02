import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setRows,
  setLoading,
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
  setRefreshNotes,
  setTotalRows,
} from "../../../redux/slices/apontamentos/notesTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import { clearCommonFilters } from "../../../redux/slices/apontamentos/commonFiltersSlice";
import NotesService from "../../../services/NotesService";
import { Box, Button, useTheme, FormControlLabel, Checkbox } from "@mui/material";
import { useNotesColumns } from "../../../hooks/apontamentos/useNotesColumns";
import BaseDataTable from "../../shared/BaseDataTable";
import { useGridApiRef, GridRowSelectionModel } from "@mui/x-data-grid";
import NoteCommentDialog from "../NoteCommentDialog";
import CommonFilters from "../CommonFilters";

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

  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedCodapont, setSelectedCodapont] = useState<number | null>(null);

  const { rows, loading, filters, page, pageSize, totalRows, refreshNotes } = useSelector(
    (state: RootState) => state.notesTable
  );
  const commonFilters = useSelector((state: RootState) => state.commonFilters.filters);
  const user = useSelector((state: RootState) => state.user.user);
  const [initialized, setInitialized] = useState(false);

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

  const handleCleanFilter = useCallback(() => {
    dispatch(clearFilters());
    dispatch(clearCommonFilters());
  }, [dispatch]);

  const handleCommentClick = useCallback((codapont: number) => {
    setSelectedCodapont(codapont);
    setCommentDialogOpen(true);
  }, []);

  const handleCloseCommentDialog = useCallback(() => {
    setCommentDialogOpen(false);
    setSelectedCodapont(null);
  }, []);

  const handleCommentChange = useCallback(() => {
    // Disparar refresh da tabela de apontamentos
    dispatch(setRefreshNotes(!refreshNotes));
  }, [dispatch, refreshNotes]);

  const { columns } = useNotesColumns(handleChangeFilters, handleCommentClick);

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
      const response = await NotesService.getMany({
        filters: {
          ...filters,
          DATA_DE: commonFilters.DATA_DE,
          DATA_ATE: commonFilters.DATA_ATE,
          ATIVOS: commonFilters.ATIVOS,
        },
        searchTerm: commonFilters.searchTerm,
        page,
        pageSize,
      });
      dispatch(setRows(response.data));
      dispatch(setTotalRows(response.total));
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
  }, [dispatch, filters, commonFilters, page, pageSize, refreshNotes]);

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      fetchData();
    }
  }, [fetchData, initialized]);

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
        <CommonFilters />

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
          disabled={selectedApontamentos.length === 0 || (!user?.PERM_APONT && !user?.PERM_ADMINISTRADOR)}
          onClick={onApontarClick}
          title={(!user?.PERM_APONT && !user?.PERM_ADMINISTRADOR) ? "Você não tem permissão para apontar" : ""}
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
        rowCount={totalRows}
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

      <NoteCommentDialog
        open={commentDialogOpen}
        onClose={handleCloseCommentDialog}
        codapont={selectedCodapont || 0}
        userName={user?.LOGIN || "SISTEMA"}
        onCommentChange={handleCommentChange}
      />
    </>
  );
};

export default ApontamentosTab;
