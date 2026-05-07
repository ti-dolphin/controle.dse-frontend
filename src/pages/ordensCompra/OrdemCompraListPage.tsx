import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import UpperNavigation from "../../components/shared/UpperNavigation";
import BaseTableToolBar from "../../components/shared/BaseTableToolBar";
import BaseDataTable from "../../components/shared/BaseDataTable";
import { RootState } from "../../redux/store";
import { useOrdemCompraColumns } from "../../hooks/ordensCompra/useOrdemCompraColumns";
import OrdemCompraService from "../../services/ordensCompra/OrdemCompraService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import {
  clearFilters,
  setFilters,
  setLoading,
  setPage,
  setPageSize,
  setRows,
  setSearchTerm,
  setTotal,
} from "../../redux/slices/ordensCompra/ordemCompraTableSlice";
import { ColumnReorderDialog } from "../../components/shared/ColumnReorderDialog";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { ColumnPreference, usePersistedColumnOrder } from "../../hooks/table/usePersistedColumnOrder";

const ORDEM_COMPRA_TABLE_KEY = "ordem-compra-list";

const OrdemCompraListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const { rows, loading, searchTerm, filters, page, pageSize, total } = useSelector(
    (state: RootState) => state.ordemCompraTable
  );

  const [columnOrderDialogOpen, setColumnOrderDialogOpen] = useState(false);

  const handleChangeFilters = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
      const value = event.target.value;
      dispatch(setFilters({ ...filters, [field]: value }));
      dispatch(setPage(0));
    },
    [dispatch, filters]
  );

  const { columns: rawColumns } = useOrdemCompraColumns(handleChangeFilters, rows);

  const { orderedColumns: columns, columnVisibilityModel, saveColumnOrder, removeColumnOrder } =
    usePersistedColumnOrder(ORDEM_COMPRA_TABLE_KEY, user!, rawColumns);

  const handleApplyColumnOrder = (preferences: ColumnPreference[]) => {
    saveColumnOrder(preferences);
  };

  const removeSavedColumnOrder = async () => {
    await removeColumnOrder();
    setColumnOrderDialogOpen(false);
  };

  const handleChangeSearchTerm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(event.target.value));
      dispatch(setPage(0));
    },
    [dispatch]
  );

  const debouncedHandleChangeSearchTerm = useMemo(() => {
    return debounce(handleChangeSearchTerm, 500);
  }, [handleChangeSearchTerm]);

  const handleCleanFilters = () => {
    dispatch(clearFilters());
  };

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await OrdemCompraService.getMany({
        searchTerm,
        filters,
        page,
        pageSize,
      });

      dispatch(setRows(data.rows || []));
      dispatch(setTotal(Number(data.total || 0)));
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      dispatch(
        setFeedback({
          message: `Erro ao buscar ordens de compra: ${error?.message || "Erro desconhecido"}`,
          type: "error",
        })
      );
    }
  }, [dispatch, searchTerm, filters, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePaginationModelChange = (model: { page: number; pageSize: number }) => {
    if (model.pageSize !== pageSize) {
      dispatch(setPageSize(model.pageSize));
      dispatch(setPage(0));
      return;
    }

    if (model.page !== page) {
      dispatch(setPage(model.page));
    }
  };

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <UpperNavigation handleBack={() => navigate("/")} />
      <Box sx={{ height: "calc(100% - 50px)", display: "flex", flexDirection: "column" }}>
        <BaseTableToolBar
          handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
          searchValue={searchTerm}
        >
          <Button
            variant="contained"
            onClick={handleCleanFilters}
            color="primary"
            sx={{ borderRadius: 0, height: 30, fontSize: "12px" }}
          >
            Limpar filtros
          </Button>
          <Tooltip title="Ordenar colunas">
            <IconButton
              onClick={() => setColumnOrderDialogOpen(true)}
              sx={{ color: "primary.main", height: 26, width: 26, borderRadius: 0 }}
            >
              <OpenWithIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </BaseTableToolBar>
        <BaseDataTable
          rows={rows}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          loading={loading}
          disableColumnMenu
          disableColumnFilter
          rowHeight={36}
          getRowId={(row: any) => row.ID}
          theme={theme}
          paginationMode="server"
          rowCount={total}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </Box>
      <ColumnReorderDialog
        open={columnOrderDialogOpen}
        onClose={() => setColumnOrderDialogOpen(false)}
        columns={columns
          .filter((col) => col.field !== "actions" && col.headerName)
          .map((col) => ({
            field: col.field,
            headerName: col.headerName!,
            hidden: columnVisibilityModel[col.field] === false,
          }))}
        onApply={handleApplyColumnOrder}
        onRemoveSavedOrder={removeSavedColumnOrder}
      />
    </Box>
  );
};

export default OrdemCompraListPage;
