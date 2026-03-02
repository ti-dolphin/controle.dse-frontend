import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setRows as setProblemaRows,
  setSelectedRow as setProblemaSelectedRow,
  setLoading as setProblemaLoading,
  setFilters as setProblemaFilters,
  clearFilters as clearProblemaFilters,
  setPage as setProblemaPage,
  setPageSize as setProblemaPageSize,
  setTotalRows as setProblemaRowCount,
} from "../../../redux/slices/apontamentos/problemaTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import { clearCommonFilters } from "../../../redux/slices/apontamentos/commonFiltersSlice";
import NotesService from "../../../services/NotesService";
import { Box, Button, useTheme, FormControlLabel, Checkbox } from "@mui/material";
import { useProblemaColumns } from "../../../hooks/apontamentos/useProblemaColumns";
import BaseDataTable from "../../shared/BaseDataTable";
import BaseDetailModal from "../../shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import { Problema } from "../../../models/Problema";
import CommonFilters from "../CommonFilters";

const ProblemasTab: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const gridRefProblema = useGridApiRef();

  const {
    rows: problemaRows,
    loading: problemaLoading,
    selectedRow: problemaSelectedRow,
    filters: problemaFilters,
    page: problemaPage,
    pageSize: problemaPageSize,
    totalRows: problemaTotalRows,
  } = useSelector((state: RootState) => state.problemaTable);
  const commonFilters = useSelector((state: RootState) => state.commonFilters.filters);
  const [initialized, setInitialized] = useState(false);

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

  const handleCleanProblemaFilter = useCallback(() => {
    dispatch(clearProblemaFilters());
    dispatch(clearCommonFilters());
  }, [dispatch]);

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
      const response = await NotesService.getManyProblema({
        filters: {
          ...problemaFilters,
          DATA_DE: commonFilters.DATA_DE,
          DATA_ATE: commonFilters.DATA_ATE,
          ATIVOS: commonFilters.ATIVOS,
        },
        searchTerm: commonFilters.searchTerm,
        page: problemaPage,
        pageSize: problemaPageSize,
      });
      dispatch(setProblemaRows(response.data));
      dispatch(setProblemaRowCount(response.total));
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
  }, [dispatch, problemaFilters, commonFilters, problemaPage, problemaPageSize]);

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      fetchProblemaData();
    }
  }, [fetchProblemaData, initialized]);

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
        rowCount={problemaTotalRows}
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
