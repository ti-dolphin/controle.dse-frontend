import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setRows as setPontoRows,
  setSelectedRow as setPontoSelectedRow,
  setLoading as setPontoLoading,
  setFilters as setPontoFilters,
  clearFilters as clearPontoFilters,
  setPage as setPontoPage,
  setPageSize as setPontoPageSize,
  setTotalRows as setPontoTotalRows,
} from "../../../redux/slices/apontamentos/pontoTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import { clearCommonFilters } from "../../../redux/slices/apontamentos/commonFiltersSlice";
import NotesService from "../../../services/NotesService";
import { Box, Button, useTheme, FormControlLabel, Checkbox } from "@mui/material";
import { usePontoColumns } from "../../../hooks/apontamentos/usePontoColumns";
import BaseDataTable from "../../shared/BaseDataTable";
import BaseDetailModal from "../../shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import { Ponto } from "../../../models/Ponto";
import CommonFilters from "../CommonFilters";

const PontoTab: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const gridRefPonto = useGridApiRef();

  const {
    rows: pontoRows,
    loading: pontoLoading,
    selectedRow: pontoSelectedRow,
    filters: pontoFilters,
    page: pontoPage,
    pageSize: pontoPageSize,
    totalRows: pontoTotalRows,
  } = useSelector((state: RootState) => state.pontoTable);
  const commonFilters = useSelector((state: RootState) => state.commonFilters.filters);
  const user = useSelector((state: RootState) => state.user.user);
  const [initialized, setInitialized] = useState(false);

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

  const handleTogglePontoField = useCallback(
    async (codapont: number, field: string, currentValue: boolean) => {
      try {
        await NotesService.updatePontoField(codapont, field, !currentValue);
        dispatch(
          setPontoRows(
            pontoRows.map((row) =>
              row.CODAPONT === codapont
                ? { ...row, [field]: !currentValue }
                : row
            )
          )
        );
      } catch (e: any) {
        dispatch(
          setFeedback({
            message: e.message || "Erro ao atualizar campo",
            type: "error",
          })
        );
      }
    },
    [dispatch, pontoRows]
  );

  const { columns: pontoColumns } = usePontoColumns(
    handleChangePontoFilters,
    handleTogglePontoField,
    !!(user?.PERM_APONTAMENTO_PONTO || user?.PERM_ADMINISTRADOR)
  );

  const handleCleanPontoFilter = useCallback(() => {
    dispatch(clearPontoFilters());
    dispatch(clearCommonFilters());
  }, [dispatch]);

  const navigateToPontoDetails = useCallback(
    (params: any) => {
      if (params.field === "actions" || params.field === "VERIFICADO" || params.field === "PROBLEMA" || params.field === "AJUSTADO") return;
      changePontoSelectedRow(params.row);
    },
    [changePontoSelectedRow]
  );

  const fetchPontoData = useCallback(async () => {
    dispatch(setPontoLoading(true));
    try {
      const response = await NotesService.getManyPonto({
        filters: {
          ...pontoFilters,
          DATA_DE: commonFilters.DATA_DE,
          DATA_ATE: commonFilters.DATA_ATE,
          ATIVOS: commonFilters.ATIVOS,
        },
        searchTerm: commonFilters.searchTerm,
        page: pontoPage,
        pageSize: pontoPageSize,
      });
      dispatch(setPontoRows(response.data));
      dispatch(setPontoTotalRows(response.total));
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
  }, [dispatch, pontoFilters, commonFilters, pontoPage, pontoPageSize]);

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      fetchPontoData();
    }
  }, [fetchPontoData, initialized]);

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
        rowCount={pontoTotalRows}
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
