import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { GridRowParams } from "@mui/x-data-grid";
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
import { OrdemCompra } from "../../models/OrdemCompra";
import {
  formatCurrency,
  formatDateStringtoISOstring,
  getDateInputValue,
  getDateStringFromISOstring,
} from "../../utils";

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
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalSaving, setApprovalSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrdemCompra | null>(null);

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

  const handleApprovalStatusChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, value: string | null) => {
      if (!value) return;
      dispatch(
        setFilters({
          ...filters,
          APPROVAL_STATUS: value as "PENDING" | "APPROVED" | "ALL",
        })
      );
      dispatch(setPage(0));
    },
    [dispatch, filters]
  );

  const handleScopeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      dispatch(
        setFilters({
          ...filters,
          SCOPE: checked ? "ALL" : "MY",
        })
      );
      dispatch(setPage(0));
    },
    [dispatch, filters]
  );

  const handleDateRangeChange = useCallback(
    (key: "DATA_EMISSAO_FROM" | "DATA_EMISSAO_TO", value: string) => {
      const isoValue = value ? formatDateStringtoISOstring(value) : "";
      dispatch(
        setFilters({
          ...filters,
          [key]: isoValue,
        })
      );
      dispatch(setPage(0));
    },
    [dispatch, filters]
  );

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const effectiveFilters = {
        ...filters,
        CODGERENTE: user?.CODGERENTE ?? null,
      };
      const data = await OrdemCompraService.getMany({
        searchTerm,
        filters: effectiveFilters,
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
  }, [dispatch, searchTerm, filters, page, pageSize, user]);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedOrder(params.row as OrdemCompra);
    setApprovalDialogOpen(true);
  };

  const handleCloseApprovalDialog = () => {
    setApprovalDialogOpen(false);
  };

  const handleManagerApprovalChange = async (approved: boolean) => {
    if (!selectedOrder) return;

    if (
      !user?.CODGERENTE ||
      String(selectedOrder.RESPONSAVEL ?? "") !== String(user?.CODGERENTE ?? "")
    ) {
      dispatch(
        setFeedback({
          message: "Usuario nao autorizado a aprovar esta ordem",
          type: "error",
        })
      );
      return;
    }

    if (approved && !user?.LOGIN) {
      dispatch(
        setFeedback({
          message: "Login do aprovador nao informado",
          type: "error",
        })
      );
      return;
    }

    setApprovalSaving(true);
    try {
      const updated = await OrdemCompraService.updateApproval(selectedOrder.ID, {
        approved,
        login: user?.LOGIN || "",
        codGerente: user?.CODGERENTE ?? null,
      });

      setSelectedOrder((prev) => (prev ? { ...prev, ...updated } : prev));
      dispatch(
        setFeedback({
          message: approved
            ? "Ordem de compra aprovada com sucesso"
            : "Ordem de compra desaprovada com sucesso",
          type: "success",
        })
      );
      await fetchData();
    } catch (error: any) {
      dispatch(
        setFeedback({
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Erro ao atualizar aprovacao",
          type: "error",
        })
      );
    } finally {
      setApprovalSaving(false);
    }
  };

  const handleDirectorApprovalChange = async (approved: boolean) => {
    if (!selectedOrder) return;

    if (!user?.PERM_DIRETOR) {
      dispatch(
        setFeedback({
          message: "Usuario nao autorizado a aprovar esta ordem",
          type: "error",
        })
      );
      return;
    }

    if (!user?.LOGIN) {
      dispatch(
        setFeedback({
          message: "Login do aprovador nao informado",
          type: "error",
        })
      );
      return;
    }

    setApprovalSaving(true);
    try {
      const updated = await OrdemCompraService.updateDirectorApproval(selectedOrder.ID, {
        approved,
        login: user?.LOGIN || "",
        permDiretor: user?.PERM_DIRETOR ?? null,
      });

      setSelectedOrder((prev) => (prev ? { ...prev, ...updated } : prev));
      dispatch(
        setFeedback({
          message: approved
            ? "Ordem de compra aprovada com sucesso"
            : "Ordem de compra desaprovada com sucesso",
          type: "success",
        })
      );
      await fetchData();
    } catch (error: any) {
      dispatch(
        setFeedback({
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Erro ao atualizar aprovacao",
          type: "error",
        })
      );
    } finally {
      setApprovalSaving(false);
    }
  };

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

  const isDirector = Boolean(user?.PERM_DIRETOR);
  const isManager =
    Boolean(user?.CODGERENTE) &&
    String(selectedOrder?.RESPONSAVEL ?? "") === String(user?.CODGERENTE ?? "");
  const isApproved = Boolean(selectedOrder?.DATAEXTRA1 && selectedOrder?.CAMPOLIVRE1);

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <UpperNavigation handleBack={() => navigate("/")} />
      <Box sx={{ height: "calc(100% - 50px)", display: "flex", flexDirection: "column" }}>
        <BaseTableToolBar
          handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
          searchValue={searchTerm}
        >
          <ToggleButtonGroup
            value={filters.APPROVAL_STATUS || "PENDING"}
            exclusive
            onChange={handleApprovalStatusChange}
            size="small"
            sx={{ height: 30 }}
          >
            <ToggleButton value="PENDING">Pendentes</ToggleButton>
            <ToggleButton value="APPROVED">Aprovadas</ToggleButton>
          </ToggleButtonGroup>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={filters.SCOPE === "ALL"}
                onChange={handleScopeChange}
              />
            }
            label="Exibir todas"
            sx={{ ml: 1 }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Emissao de"
              type="date"
              size="small"
              value={getDateInputValue(filters.DATA_EMISSAO_FROM) || ""}
              onChange={(event) =>
                handleDateRangeChange("DATA_EMISSAO_FROM", event.target.value)
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="ate"
              type="date"
              size="small"
              value={getDateInputValue(filters.DATA_EMISSAO_TO) || ""}
              onChange={(event) =>
                handleDateRangeChange("DATA_EMISSAO_TO", event.target.value)
              }
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
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
          onRowClick={handleRowClick}
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
      <Dialog open={approvalDialogOpen} onClose={handleCloseApprovalDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Status da ordem de compra</DialogTitle>
        <DialogContent>
          {selectedOrder ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Typography fontSize="14px" fontWeight={600}>
                  {selectedOrder.DATAEXTRA1 && selectedOrder.CAMPOLIVRE1
                    ? "Aprovada"
                    : "Nao aprovada"}
                </Typography>
                {selectedOrder.DATAEXTRA1 && selectedOrder.CAMPOLIVRE1 ? (
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    <Typography fontSize="12px">
                      Aprovada em: {getDateStringFromISOstring(selectedOrder.DATAEXTRA1)}
                    </Typography>
                    <Typography fontSize="12px">
                      Aprovador: {selectedOrder.CAMPOLIVRE1}
                    </Typography>
                  </Stack>
                ) : null}
              </Box>
              <Box>
                <Typography fontSize="12px">
                  Numero: {selectedOrder.NUMERO_MOVIMENTO}
                </Typography>
                <Typography fontSize="12px">
                  Fornecedor: {selectedOrder.FORNECEDOR}
                </Typography>
                <Typography fontSize="12px">
                  Valor bruto: {formatCurrency(Number(selectedOrder.VALOR_BRUTO || 0))}
                </Typography>
              </Box>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApprovalDialog} disabled={approvalSaving}>
            Fechar
          </Button>
          {selectedOrder && isManager ? (
            <Button
              variant="contained"
              color={isApproved ? "warning" : "primary"}
              onClick={() => handleManagerApprovalChange(!isApproved)}
              disabled={approvalSaving}
              sx={{ borderRadius: 0 }}
            >
              {isApproved ? "Desaprovar" : "Aprovar"}
            </Button>
          ) : null}
          {selectedOrder && isDirector ? (
            <Button
              variant="contained"
              color={isApproved ? "warning" : "primary"}
              onClick={() => handleDirectorApprovalChange(!isApproved)}
              disabled={approvalSaving}
              sx={{ borderRadius: 0 }}
            >
              {isApproved ? "Desaprovar Diretoria" : "Aprovar Diretoria"}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdemCompraListPage;
