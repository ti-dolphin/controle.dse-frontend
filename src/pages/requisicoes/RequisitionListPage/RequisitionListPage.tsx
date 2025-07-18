import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setRows,
  setSelectedRow,
  setKanbans,
  setSelectedKanban,
  setLoading,
  setSearchTerm,
  setFilters,
  RequisitionFilters,
  filterFieldMap,
  buildPrismaFilters,
} from "../../../redux/slices/requisicoes/requisitionTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import RequisitionService from "../../../services/requisicoes/RequisitionService";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  SelectChangeEvent,
  TextField,
  useTheme,
} from "@mui/material";
import { useRequisitionColumns } from "../../../hooks/requisicoes/RequisitionTableColumnsHook";
import BaseDataTable from "../../../components/shared/BaseDataTable";
import BaseDetailModal from "../../../components/shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import { RequisitionKanban } from "../../../models/requisicoes/RequisitionKanban";
import { useRequisitionKanban } from "../../../hooks/requisicoes/RequisitionKanbanHook";
import BaseToolBar from "../../../components/shared/BaseToolBar";
import BaseDropdown from "../../../components/shared/BaseDropdown";
import { ReducedUser } from "../../../models/User";
import BaseTableToolBar from "../../../components/shared/BaseTableToolBar";
import { debounce } from "lodash";
import BaseTableColumnFilters from "../../../components/shared/BaseTableColumnFilters";
import RequisitionFormModal from "../../../components/requisicoes/RequisitionFormModal";
import { useNavigate } from "react-router-dom";

const RequisitionListPage = () => {
  useRequisitionKanban();
  const [triggerFetch, setTriggerFetch] = useState(0);
  const dispatch = useDispatch();
  const theme = useTheme();
  const width = window.innerWidth;
  const user = useSelector((state: RootState) => state.user.user);
  const rows = useSelector((state: RootState) => state.requisitionTable.rows);
  const navigate = useNavigate();
  
  const searchTerm = useSelector(
    (state: RootState) => state.requisitionTable.searchTerm
  );
  const filters = useSelector(
    (state: RootState) => state.requisitionTable.filters
  );
  const loading = useSelector(
    (state: RootState) => state.requisitionTable.loading
  );
  const selectedRow = useSelector(
    (state: RootState) => state.requisitionTable.selectedRow
  );
  const kanbans = useSelector(
    (state: RootState) => state.requisitionTable.kanbans
  );
  const selectedKanban = useSelector(
    (state: RootState) => state.requisitionTable.selectedKanban
  );
  const changeSelectedRow = (row: any) => {
    dispatch(setSelectedRow(row));
  };
  const gridRef = useGridApiRef();

  const { columns, secondaryColumns } = useRequisitionColumns(changeSelectedRow); //RETURNS MAIN COLUMNS ARRAY AND SECONDARY COLUMNS

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

  const navigateToRequisitionDetails = ( params : any) =>  {
    console.log("params: ", params)
    const {id} = params;
    navigate(`/requisicoes/${id}`);
  }

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

  const debouncedHandleChangeSearchTerm = useMemo(() => {
    return debounce(handleChangeSearchTerm, 500);
  }, [handleChangeSearchTerm]);

  const debouncedSetTriggerFetch = useMemo(() => {
    return debounce(() => setTriggerFetch((prev) => prev + 1), 800);
  }, []);

  const fetchData = React.useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const prismaFilters = buildPrismaFilters(filters);
      console.log("prismaFilters", JSON.stringify(prismaFilters));
      const data = await RequisitionService.getMany(user as ReducedUser, {
        id_kanban_requisicao: selectedKanban?.id_kanban_requisicao,
        searchTerm,
        filters: prismaFilters,
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
  }, [dispatch, user, selectedKanban, searchTerm, filters, triggerFetch]);

  useEffect(() => {
    if (selectedKanban && user) {
      fetchData();
    }
  }, [selectedKanban, searchTerm, filters, fetchData, user]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          height: "98%",
          width: "98%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BaseToolBar transparent={false}>
          <Box sx={{ display: "flex", gap: 2, boxShadow: "none" }}>
            {window.innerWidth < 768 && (
              <BaseDropdown
                label="Kanban"
                options={kanbans.map((kanban: RequisitionKanban) => ({
                  label: kanban.nome,
                  value: kanban.id_kanban_requisicao,
                }))}
                value={selectedKanban?.id_kanban_requisicao || ""}
                onChange={handleChangeKanban}
                backgroundColor={""}
              ></BaseDropdown>
            )}
            {window.innerWidth > 768 &&
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
                    borderRadius: 2,
                  }}
                >
                  {kanban.nome}
                </Button>
              ))}
          </Box>
          <RequisitionFormModal />
        </BaseToolBar>
        <BaseTableToolBar
          handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
        />
        
        <BaseTableColumnFilters
          columns={columns}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
          debouncedSetTriggerFetch={debouncedSetTriggerFetch}
        />
        <BaseDataTable
          apiRef={gridRef}
          rows={rows}
          disableColumnMenu
          disableColumnFilter
          rowHeight={44}
          columns={columns}
          loading={loading}
          onRowClick={(params) => navigateToRequisitionDetails(params)}
          getRowId={(row: any) => row.ID_REQUISICAO}
          theme={theme}
        />
      </Box>
      {/* DISPLAYS SECONDARY DATA */}
      <BaseDetailModal
        open={selectedRow !== null}
        onClose={() => dispatch(setSelectedRow(null))}
        columns={secondaryColumns}
        row={selectedRow}
        ref={gridRef}
      />
    </Box>
  );
};

export default RequisitionListPage;
