import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buildPatrimonyPrismaFilters, cleanFilters, deleteSingleRow, setFilters, setIsLoading, setPatrimonyBeingDeleted, setRows, setSearch, } from "../../redux/slices/patrimonios/PatrimonyTableSlice";
import MovementationService from "../../services/patrimonios/MovementationService";
import { Badge, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography, } from "@mui/material";
import { usePatMovementationColumns } from "../../hooks/patrimonios/usePatMovementationColumns";
import { useTheme } from "@mui/material/styles";
import BaseTableToolBar from "../../components/shared/BaseTableToolBar";
import BaseTableColumnFilters from "../../components/shared/BaseTableColumnFilters";
import BaseDataTable from "../../components/shared/BaseDataTable";
import { debounce, filter } from "lodash";
import { useGridApiRef } from "@mui/x-data-grid";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useNavigate } from "react-router-dom";
import UpperNavigation from "../../components/shared/UpperNavigation";
import PatrimonyForm from "../../components/patrimonios/PatrimonyForm";
import { BaseAddButton } from "../../components/shared/BaseAddButton";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BaseDeleteDialog from "../../components/shared/BaseDeleteDialog";
import { PatrimonyService } from "../../services/patrimonios/PatrimonyService";
import { useChecklistNotifications } from "../../hooks/patrimonios/useChecklistNotifications";
const PatrimonyListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const user = useSelector((state) => state.user.user);
    const { rows, isLoading, filters, search, patrimonyBeingDeleted } = useSelector((state) => state.patrionyTable);
    const [creating, setCreating] = React.useState(false);
    const { notifications } = useChecklistNotifications();
    const { columns } = usePatMovementationColumns();
    const gridRef = useGridApiRef();
    const handleBack = () => {
        navigate("/");
    };
    const navigateToPatrimonyDetail = (params) => {
        if (params.field === "actions")
            return;
        navigate(`/patrimonios/${params.row.id_patrimonio}`);
    };
    const handleChangeSearchTerm = React.useCallback((event) => {
        const value = event.target.value;
        dispatch(setSearch(value.toLowerCase()));
    }, [dispatch, filter]);
    const handleChangeFilters = React.useCallback((e, field) => {
        let value = e.target.value;
        if (value && !isNaN(Number(value)) && value.trim() !== "") {
            value = Number(value);
        }
        dispatch(setFilters({ ...filters, [field]: value }));
    }, [dispatch, filters]);
    const deletePatrimony = async () => {
        if (!patrimonyBeingDeleted)
            return;
        try {
            const deleted = await PatrimonyService.delete(patrimonyBeingDeleted.id_patrimonio || 0);
            if (deleted) {
                dispatch(setPatrimonyBeingDeleted(null));
                dispatch(deleteSingleRow(patrimonyBeingDeleted.id_patrimonio));
                dispatch(setFeedback({
                    message: "Patrimônio deletado com sucesso",
                    type: "success",
                }));
            }
        }
        catch (e) {
            dispatch(setFeedback({
                message: "Houve um erro ao deletar o patrimônio",
                type: "error",
            }));
        }
    };
    const debouncedHandleChangeSearchTerm = useMemo(() => {
        return debounce(handleChangeSearchTerm, 500);
    }, [handleChangeSearchTerm, filters]);
    const handleCleanFilter = () => {
        // Implement filter cleaning logic here
        dispatch(cleanFilters());
    };
    const fetchData = React.useCallback(async () => {
        dispatch(setIsLoading(true));
        try {
            const prismaFilters = buildPatrimonyPrismaFilters(filters);
            const data = await MovementationService.getMany({
                from: "patrimonios",
                search,
                prismaFilters,
            });
            dispatch(setRows(data));
            dispatch(setIsLoading(false));
        }
        catch (e) {
            dispatch(setIsLoading(false));
            dispatch(setFeedback({
                message: "Houve um erro ao buscar requisições",
                type: "error",
            }));
        }
    }, [dispatch, user, search, filters]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    function debouncedSetTriggerFetch() {
        throw new Error("Function not implemented.");
    }
    return (_jsxs(Box, { sx: { height: "100vh", width: "100%" }, children: [_jsx(UpperNavigation, { handleBack: handleBack }), _jsxs(Box, { sx: {
                    height: "94%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                }, children: [_jsx(BaseTableToolBar, { handleChangeSearchTerm: debouncedHandleChangeSearchTerm, children: _jsxs(Stack, { direction: "row", alignItems: "center", gap: 1, children: [_jsx(Button, { variant: "contained", onClick: handleCleanFilter, children: "Limpar filtros" }), _jsx(BaseAddButton, { handleOpen: () => setCreating(true) }), _jsx(IconButton, { onClick: () => navigate("/patrimonios/checklists"), sx: {
                                        color: "primary.main",
                                        width: 32,
                                        height: 34,
                                    }, children: _jsx(Badge, { badgeContent: notifications, color: "primary", children: _jsx(NotificationsIcon, {}) }) })] }) }), _jsx(BaseTableColumnFilters, { columns: columns, filters: filters, handleChangeFilters: handleChangeFilters, debouncedSetTriggerFetch: debouncedSetTriggerFetch }), _jsx(BaseDataTable, { apiRef: gridRef, onCellClick: navigateToPatrimonyDetail, rows: rows, disableColumnMenu: true, disableColumnFilter: true, rowHeight: 40, columns: columns, loading: isLoading, getRowId: (row) => row.id_movimentacao, theme: theme })] }), _jsxs(Dialog, { open: creating, children: [_jsx(DialogTitle, { children: _jsx(Typography, { variant: "h6", color: "primary", children: "Criar patrimon\u00F4nio" }) }), _jsxs(DialogContent, { sx: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            width: {
                                xs: "100%",
                                sm: "500px",
                                md: "400px",
                            },
                        }, children: [_jsx(IconButton, { sx: { position: "absolute", top: 0, right: 0 }, children: _jsx(CloseIcon, { color: "error", onClick: () => setCreating(false) }) }), _jsx(PatrimonyForm, {})] })] }), _jsx(BaseDeleteDialog, { open: patrimonyBeingDeleted !== null, onCancel: () => {
                    dispatch(setPatrimonyBeingDeleted(null));
                }, onConfirm: () => deletePatrimony() })] }));
};
export default PatrimonyListPage;
