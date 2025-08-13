import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRows, setSelectedRow, setSelectedKanban, setLoading, setSearchTerm, setFilters, clearfilters, } from "../../../redux/slices/requisicoes/requisitionTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import RequisitionService from "../../../services/requisicoes/RequisitionService";
import { Box, Button, useTheme, } from "@mui/material";
import { useRequisitionColumns } from "../../../hooks/requisicoes/RequisitionTableColumnsHook";
import BaseDataTable from "../../../components/shared/BaseDataTable";
import BaseDetailModal from "../../../components/shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import { useRequisitionKanban } from "../../../hooks/requisicoes/RequisitionKanbanHook";
import BaseToolBar from "../../../components/shared/BaseToolBar";
import BaseDropdown from "../../../components/shared/BaseDropdown";
import BaseTableToolBar from "../../../components/shared/BaseTableToolBar";
import { debounce } from "lodash";
import BaseTableColumnFilters from "../../../components/shared/BaseTableColumnFilters";
import RequisitionFormModal from "../../../components/requisicoes/RequisitionFormModal";
import { useNavigate } from "react-router-dom";
import UpperNavigation from "../../../components/shared/UpperNavigation";
const RequisitionListPage = () => {
    useRequisitionKanban();
    const [triggerFetch, setTriggerFetch] = useState(0);
    const dispatch = useDispatch();
    const theme = useTheme();
    const user = useSelector((state) => state.user.user);
    const rows = useSelector((state) => state.requisitionTable.rows);
    const navigate = useNavigate();
    const { searchTerm, filters, loading, selectedRow, kanbans, selectedKanban, } = useSelector((state) => state.requisitionTable);
    const changeSelectedRow = (row) => {
        dispatch(setSelectedRow(row));
    };
    const gridRef = useGridApiRef();
    const { columns, secondaryColumns } = useRequisitionColumns(changeSelectedRow, gridRef); //RETURNS MAIN COLUMNS ARRAY AND SECONDARY COLUMNS
    const handleChangeKanban = React.useCallback((event) => {
        const selectedKanban = kanbans.find((kanban) => kanban.id_kanban_requisicao === Number(event.target.value));
        if (selectedKanban) {
            dispatch(setSelectedKanban(selectedKanban));
            return;
        }
    }, [kanbans, dispatch]);
    const handleChangeSearchTerm = React.useCallback((event) => {
        const value = event.target.value;
        dispatch(setSearchTerm(value.toLowerCase()));
    }, [dispatch]);
    const handleBack = () => {
        navigate("/");
    };
    const navigateToRequisitionDetails = (params) => {
        if (params.field === 'actions')
            return;
        const { id } = params;
        navigate(`/requisicoes/${id}`);
    };
    const handleChangeFilters = React.useCallback((e, field) => {
        let value = e.target.value;
        // Try to convert to number if it's a numeric value
        if (!isNaN(Number(value)) && value.trim() !== "") {
            value = Number(value);
        }
        dispatch(setFilters({ ...filters, [field]: value }));
    }, [dispatch, filters]);
    const handleCleanFilter = () => [dispatch(clearfilters())];
    const debouncedHandleChangeSearchTerm = useMemo(() => {
        return debounce(handleChangeSearchTerm, 500);
    }, [handleChangeSearchTerm]);
    const debouncedSetTriggerFetch = useMemo(() => {
        return debounce(() => setTriggerFetch((prev) => prev + 1), 800);
    }, []);
    const fetchData = React.useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await RequisitionService.getMany(user, {
                id_kanban_requisicao: selectedKanban?.id_kanban_requisicao,
                searchTerm,
                filters,
            });
            dispatch(setRows(data));
            dispatch(setLoading(false));
        }
        catch (e) {
            dispatch(setLoading(false));
            dispatch(setFeedback({
                message: "Houve um erro ao buscar requisições",
                type: "error",
            }));
        }
    }, [dispatch, user, selectedKanban, searchTerm, filters, triggerFetch]);
    useEffect(() => {
        if (selectedKanban && user) {
            fetchData();
        }
    }, [selectedKanban, searchTerm, filters, fetchData, user]);
    return (_jsxs(Box, { sx: {
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "center",
            padding: 0.5,
        }, children: [_jsx(UpperNavigation, { handleBack: handleBack }), _jsxs(Box, { sx: {
                    height: "95%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                }, children: [_jsxs(BaseToolBar, { transparent: false, children: [_jsxs(Box, { sx: { display: "flex", gap: 2, boxShadow: "none" }, children: [window.innerWidth < 768 && (_jsx(BaseDropdown, { label: "Kanban", options: kanbans.map((kanban) => ({
                                            label: kanban.nome,
                                            value: kanban.id_kanban_requisicao,
                                        })), value: selectedKanban?.id_kanban_requisicao || "", onChange: handleChangeKanban, backgroundColor: "" })), window.innerWidth > 768 &&
                                        kanbans.map((kanban) => (_jsx(Button, { onClick: () => dispatch(setSelectedKanban(kanban)), sx: {
                                                backgroundColor: selectedKanban?.id_kanban_requisicao ===
                                                    kanban.id_kanban_requisicao
                                                    ? "secondary.main"
                                                    : "primary.main",
                                                color: "white",
                                                textTransform: "capitalize",
                                                borderRadius: 0,
                                            }, children: kanban.nome }, kanban.id_kanban_requisicao)))] }), _jsx(RequisitionFormModal, {})] }), _jsx(BaseTableToolBar, { handleChangeSearchTerm: debouncedHandleChangeSearchTerm, children: _jsx(Button, { variant: "contained", onClick: handleCleanFilter, children: "Limpar filtros" }) }), _jsx(BaseTableColumnFilters, { columns: columns, filters: filters, handleChangeFilters: handleChangeFilters, debouncedSetTriggerFetch: debouncedSetTriggerFetch }), _jsx(BaseDataTable, { apiRef: gridRef, rows: rows, disableColumnMenu: true, disableColumnFilter: true, rowHeight: 40, columns: columns, loading: loading, 
                        // onRowClick={(params) => navigateToRequisitionDetails(params)}
                        onCellClick: (params) => navigateToRequisitionDetails(params), getRowId: (row) => row.ID_REQUISICAO, theme: theme })] }), _jsx(BaseDetailModal, { open: selectedRow !== null, onClose: () => dispatch(setSelectedRow(null)), columns: secondaryColumns, row: selectedRow, ref: gridRef })] }));
};
export default RequisitionListPage;
