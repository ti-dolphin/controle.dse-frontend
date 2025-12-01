import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setRows,
  setSelectedRow,
  setSelectedKanban,
  setLoading,
  setSearchTerm,
  setFilters,
  clearfilters,
  setRequisitionBeingDeletedId,
  removeRow,
} from "../../../redux/slices/requisicoes/requisitionTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import RequisitionService from "../../../services/requisicoes/RequisitionService";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, SelectChangeEvent, useTheme } from "@mui/material";
import { useRequisitionColumns } from "../../../hooks/requisicoes/useRequisitionColumns";
import BaseDataTable from "../../../components/shared/BaseDataTable";
import BaseDetailModal from "../../../components/shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import { RequisitionKanban } from "../../../models/requisicoes/RequisitionKanban";
import { useRequisitionKanban } from "../../../hooks/requisicoes/useRequisitionKanban";
import BaseToolBar from "../../../components/shared/BaseToolBar";
import BaseDropdown from "../../../components/shared/BaseDropdown";
import BaseTableToolBar from "../../../components/shared/BaseTableToolBar";
import { debounce } from "lodash";
import RequisitionFormModal from "../../../components/requisicoes/RequisitionFormModal";
import { useNavigate } from "react-router-dom";
import UpperNavigation from "../../../components/shared/UpperNavigation";
import BaseDeleteDialog from "../../../components/shared/BaseDeleteDialog";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { FixedSizeGrid } from "react-window";
import DataCard from "../../../components/shared/DataCard";
import RequisitionCard from "../../../components/requisicoes/RequisitionCard";
import { User, ReducedUser } from "../../../models/User";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { setViewingProducts } from "../../../redux/slices/productSlice";
import ProductsTable from "../../../components/requisicoes/ProductsTable";
import CloseIcon from "@mui/icons-material/Close";
import NotificationBell from "../../../components/requisicoes/NotificationBell";

const RequisitionListPage = () => {
    useRequisitionKanban();
    const [triggerFetch, setTriggerFetch] = useState(0);
    const [doneReqFilter, setDoneReqFilter] = useState(false);
    const [cancelledReqFilter, setCancelledReqFilter] = useState(false);
    const dispatch = useDispatch();
    const theme = useTheme();
    const user = useSelector((state: RootState) => state.user.user);
    const { rows } = useSelector((state: RootState) => state.requisitionTable);
    const navigate = useNavigate();
    const gridContainerRef = React.useRef<HTMLDivElement>(null);
    const {
      searchTerm,
      filters,
      loading,
      selectedRow,
      kanbans,
      selectedKanban,
      requisitionBeingDeletedId,
    } = useSelector((state: RootState) => state.requisitionTable);

    const {isMobile } = useIsMobile();
    const {viewingProducts} = useSelector((state: RootState) => state.productSlice);
    const changeSelectedRow = (row: any) => {
      dispatch(setSelectedRow(row));
    };
    const gridRef = useGridApiRef();

    const handleChangeFilters = React.useCallback(
      (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: string
      ) => {
        let value: any = e.target.value;
        // Try to convert to number if it's a numeric value
        if (!isNaN(Number(value)) && value.trim() !== "") {
          value = Number(value);
        }
        dispatch(setFilters({ ...filters, [field]: value }));
      },
      [dispatch, filters]
    );

    const { columns, secondaryColumns } = useRequisitionColumns(
      handleChangeFilters,
      changeSelectedRow,
      gridRef
    ); //RETURNS MAIN COLUMNS ARRAY AND SECONDARY COLUMNS

    const handleChangeKanban = React.useCallback(
      (event: SelectChangeEvent<unknown>) => {
        const selectedKanban = kanbans.find(
          (kanban: RequisitionKanban) =>
            kanban.id_kanban_requisicao === Number(event.target.value)
        );
        if (selectedKanban) {
          dispatch(setSelectedKanban(selectedKanban));
          return;
        }
      },
      [kanbans, dispatch]
    );

    const handleChangeSearchTerm = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        dispatch(setSearchTerm(value.toLowerCase()));
      },
      [dispatch]
    );

    const handleDeleteRequisition = async () => {
      if (!requisitionBeingDeletedId) return;
      try {
        await RequisitionService.delete(requisitionBeingDeletedId);
        dispatch(setRequisitionBeingDeletedId(null));
        dispatch(removeRow(requisitionBeingDeletedId));
        dispatch(
          setFeedback({
            message: "Requisição deletada com sucesso",
            type: "success",
          })
        );
      } catch (e) {
        dispatch(
          setFeedback({
            message: "Houve um erro ao deletar a requisição",
            type: "error",
          })
        );
      }
    };

    const handleBack = () => {
      navigate("/");
    };

    const navigateToRequisitionDetails = (params: any) => {
      if (params.field === "actions") return;
      const { id } = params;
      navigate(`/requisicoes/${id}`);
    };



    const handleCleanFilter = () => { 
      dispatch(clearfilters());
      setDoneReqFilter(false);
      setCancelledReqFilter(false);
    };

    const debouncedHandleChangeSearchTerm = useMemo(() => {
      return debounce(handleChangeSearchTerm, 500);
    }, [handleChangeSearchTerm]);

    // Corrija o fetchData para depender dos filtros corretos
    const fetchData = React.useCallback(async () => {
      dispatch(setLoading(true));
      try {
        const data = await RequisitionService.getMany(user as User, {
          id_kanban_requisicao: selectedKanban?.id_kanban_requisicao,
          searchTerm,
          filters,
          doneReqFilter,
          cancelledReqFilter,
          removeAdmView: true
        });
        dispatch(setRows(data));
        dispatch(setLoading(false));
      } catch (e: any) {
        dispatch(setLoading(false));
        dispatch(
          setFeedback({
            message: "Houve um erro ao buscar requisições",
            type: "error",
          })
        );
      }
    }, [
      dispatch,
      user,
      selectedKanban,
      searchTerm,
      filters,
      triggerFetch,
      doneReqFilter,
      cancelledReqFilter 
    ]);

    useEffect(() => {

      if (selectedKanban && user) {
        fetchData();
      }
    }, [
      selectedKanban,
      searchTerm,
      filters,
      fetchData,
      user,
      doneReqFilter,
      cancelledReqFilter,
    ]);

    // Adicione aqui as funções de filtro para os checkboxes
    const handleFilterConcluidos = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setDoneReqFilter(checked);
    };
    const handleFilterCancelados = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setCancelledReqFilter(checked);
    };

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
          <Box sx={{ display: "flex", gap: 2, boxShadow: "none" }}>
            {isMobile ? (
              <BaseDropdown
                label="Kanban"
                options={kanbans.map((kanban: RequisitionKanban) => ({
                  label: kanban.nome,
                  value: kanban.id_kanban_requisicao,
                }))}
                value={selectedKanban?.id_kanban_requisicao || ""}
                onChange={handleChangeKanban}
                backgroundColor={""}
              />
            ) : (
              kanbans.map((kanban: RequisitionKanban) => (
                <Button
                  key={kanban.id_kanban_requisicao}
                  onClick={() => dispatch(setSelectedKanban(kanban))}
                  sx={{
                    backgroundColor:
                      selectedKanban?.id_kanban_requisicao ===
                      kanban.id_kanban_requisicao
                        ? "secondary.main"
                        : "primary.main",
                    color: "white",
                    textTransform: "capitalize",
                    borderRadius: 0,
                    height: 26,
                  }}
                >
                  {kanban.nome}
                </Button>
              ))
            )}
          </Box>
          <RequisitionFormModal />

          <Box
            sx={{
              position: "absolute",
              right: 10,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <NotificationBell />
            <Button
              sx={{
                color: "white",
                textTransform: "capitalize",
                borderRadius: 0,
                height: 26,
              }}
              startIcon={<Inventory2Icon />}
              onClick={() => dispatch(setViewingProducts(true))}
            >
              Produtos
            </Button>
          </Box>
        </BaseToolBar>
        <BaseTableToolBar
          handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
        >
          {!isMobile && selectedKanban?.id_kanban_requisicao === 5 && (
            <>
              {/* Checkbox para filtrar concluídos */}
              <Box sx={{ display: "inline-flex", alignItems: "center", ml: 2 }}>
                <input
                  type="checkbox"
                  id="filter-concluidos"
                  onChange={handleFilterConcluidos}
                  checked={doneReqFilter}
                />
                <label htmlFor="filter-concluidos" style={{ marginLeft: 4, fontSize: 14 }}>
                  Concluídos
                </label>
              </Box>
              {/* Checkbox para filtrar cancelados */}
              <Box sx={{ display: "inline-flex", alignItems: "center", ml: 2 }}>
                <input
                  type="checkbox"
                  id="filter-cancelados"
                  onChange={handleFilterCancelados}
                  checked={cancelledReqFilter}
                />
                <label htmlFor="filter-cancelados" style={{ marginLeft: 4, fontSize: 14 }}>
                  Cancelados
                </label>
              </Box>
              <Button
                sx={{ height: 30, borderRadius: 0 }}
                variant="contained"
                onClick={handleCleanFilter}
              >
                Limpar filtros
              </Button>
            </>
          )}
        </BaseTableToolBar>
        {isMobile ? (
          <Box
            ref={gridContainerRef}
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 1,
            }}
          >
            <FixedSizeGrid
              style={{ margin: "auto" }}
              columnWidth={gridContainerRef.current?.offsetWidth || 300}
              rowHeight={260}
              columnCount={1}
              rowCount={rows.length}
              width={gridContainerRef.current?.offsetWidth || 300}
              height={gridContainerRef.current?.offsetHeight || 400}
            >
              {({ columnIndex, rowIndex, style }) => {
                const itemIndex = rowIndex;
                const requisition = rows[itemIndex];
                if (!requisition) return null;
                return (
                  <RequisitionCard
                    req={requisition}
                    style={style}
                    onClickDetails={() =>
                      navigate(`/requisicoes/${requisition.ID_REQUISICAO}`)
                    }
                  />
                );
              }}
            </FixedSizeGrid>
          </Box>
        ) : (
          <BaseDataTable
            apiRef={gridRef}
            rows={rows}
            disableColumnMenu
            disableColumnFilter
            rowHeight={40}
            columns={columns}
            loading={loading}
            onCellClick={(params: { field: string; }) =>
              params.field !== "actions" && navigateToRequisitionDetails(params)
            }
            getRowId={(row: any) => row.ID_REQUISICAO}
            theme={theme}
          />
        )}
      </Box>
      <BaseDetailModal
        open={selectedRow !== null}
        onClose={() => dispatch(setSelectedRow(null))}
        columns={columns}
        row={selectedRow}
        ref={gridRef}
      />
      <BaseDeleteDialog
        open={requisitionBeingDeletedId !== null}
        onConfirm={handleDeleteRequisition}
        onCancel={() => dispatch(setRequisitionBeingDeletedId(null))}
      />

      <Dialog
        open={viewingProducts}
        onClose={() => dispatch(setViewingProducts(false))}
        fullScreen
      >
        <IconButton
          onClick={() => dispatch(setViewingProducts(false))}
          sx={{ position: "absolute", top: 0, right: 0, color: "red" }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle>Produtos</DialogTitle>
        <DialogContent sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }}>
            <ProductsTable tipoFaturamento={0} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RequisitionListPage;
