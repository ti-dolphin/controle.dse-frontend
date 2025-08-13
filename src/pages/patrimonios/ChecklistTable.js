import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CheckListService } from "../../services/patrimonios/ChecklistService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import BaseDataTable from "../../components/shared/BaseDataTable";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { formatDateToISOstring, getDateFromDateString, getDateFromISOstring, } from "../../utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BaseTableColumnFilters from "../../components/shared/BaseTableColumnFilters";
import BaseTableToolBar from "../../components/shared/BaseTableToolBar";
import { debounce } from "lodash";
import CloseIcon from "@mui/icons-material/Close";
import ChecklistView from "./ChecklistView";
import { setFilters, setRefresh, setRows, setSearchTerm } from "../../redux/slices/patrimonios/ChecklistTableSlice";
const situations = [
    { value: "pendente", label: "Pendente" },
    { value: "cobrar", label: "Cobrar" },
    { value: "aprovar", label: "Aprovar" },
];
const ChecklistTable = () => {
    const theme = useTheme();
    const { id_patrimonio } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const { rows, filters, searchTerm, refresh } = useSelector((state) => state.checklistTable);
    const [from, setFrom] = useState("patrimonio");
    const [situation, setSituation] = React.useState("pendente");
    const [loading, setLoading] = React.useState(false);
    const [checklistSelected, setChecklistSelected] = React.useState(null);
    const columns = [
        {
            field: "id_checklist_movimentacao",
            headerName: "ID",
            type: "number",
            flex: 0.2,
        },
        {
            field: "patrimonio_nome",
            headerName: "Patrimônio",
            type: "string",
            flex: 1,
        },
        {
            field: "responsavel_nome",
            headerName: "Responsável",
            type: "string",
            flex: 1,
        },
        {
            field: "realizado",
            headerName: "Realizado",
            flex: 0.3,
            type: "boolean",
            renderCell: (params) => (_jsx(Box, { sx: { color: params.value ? "green" : "red" }, children: params.value ? _jsx(CheckCircleIcon, {}) : _jsx(CancelIcon, {}) })),
        },
        {
            field: "aprovado",
            headerName: "Aprovado",
            flex: 0.3,
            type: "boolean",
            renderCell: (params) => (_jsx(Box, { sx: { color: params.value ? "green" : "red" }, children: params.value ? _jsx(CheckCircleIcon, {}) : _jsx(CancelIcon, {}) })),
        },
        {
            field: "data_realizado",
            headerName: "Data da realização",
            flex: 0.4,
            type: "date",
            valueGetter: (date) => (date ? getDateFromISOstring(date) : ""),
        },
        {
            field: "data_aprovado",
            headerName: "Data da aprovação",
            flex: 0.4,
            type: "date",
            valueGetter: (date) => (date ? getDateFromISOstring(date) : ""),
        },
    ];
    const handleChangeFilters = (e, field) => {
        const value = e.target.value;
        dispatch(setFilters({ ...filters, [field]: value }));
    };
    const handleRowClick = (checklist) => {
        setChecklistSelected(checklist);
    };
    const formatFilters = (filters) => {
        const dateFilters = ["data_realizado", "data_aprovado"];
        const formattedFilters = { ...filters };
        dateFilters.forEach((field) => {
            const dateValue = getDateFromDateString(String(filters[field]));
            formattedFilters[field] = dateValue
                ? formatDateToISOstring(dateValue)
                : null;
        });
        const numericFields = ["id_checklist_movimentacao"];
        numericFields.forEach((field) => {
            formattedFilters[field] = filters[field]
                ? Number(filters[field])
                : null;
        });
        return formattedFilters;
    };
    const handleChangeSearchTerm = (e) => {
        const value = e.target.value;
        dispatch(setSearchTerm(value));
    };
    const debouncedHanleChangeSearchTerm = debounce(handleChangeSearchTerm, 500);
    const fetchChecklistsByPatrimony = React.useCallback(async () => {
        try {
            if (!id_patrimonio)
                return;
            setLoading(true);
            const params = {
                filters: formatFilters(filters),
                searchTerm,
                id_patrimonio: Number(id_patrimonio),
            };
            const data = await CheckListService.getMany(params);
            dispatch(setRows(data));
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            dispatch(setFeedback({
                message: "Houve um erro ao buscar os dados",
                type: "error",
            }));
        }
    }, [filters, searchTerm, id_patrimonio, dispatch, refresh]);
    const fetchChecklistsByUser = React.useCallback(async () => {
        try {
            if (!user)
                return;
            setLoading(true);
            const params = {
                situacao: situation,
                filters: formatFilters(filters),
                searchTerm,
            };
            const data = await CheckListService.getManyByUser(user.CODPESSOA, params);
            dispatch(setRows(data));
            setLoading(false);
        }
        catch (e) {
            dispatch(setFeedback({
                message: "Houve um erro ao buscar os dados",
                type: "error",
            }));
        }
    }, [filters, searchTerm, dispatch, situation, refresh]);
    const renderSituation = (checklist) => {
        if (!checklist)
            return "";
        const pendente = !(checklist.aprovado || checklist.realizado);
        const aprovado = checklist.realizado && checklist.aprovado;
        const waitingAproval = checklist.realizado && !checklist.aprovado;
        if (pendente)
            return "Pendente";
        if (aprovado)
            return "Aprovado";
        if (waitingAproval)
            return "Aprovação pendente";
    };
    //useEffect
    React.useEffect(() => {
        if (id_patrimonio) {
            setFrom("patrimonio");
            fetchChecklistsByPatrimony();
            return;
        }
        setFrom('checklists');
        fetchChecklistsByUser();
    }, [fetchChecklistsByPatrimony, fetchChecklistsByUser]);
    return (_jsxs(Box, { sx: { display: "flex", flexDirection: "column", height: "100%" }, children: [_jsx(BaseTableToolBar, { handleChangeSearchTerm: debouncedHanleChangeSearchTerm, children: from === "checklists" && (_jsx(Stack, { direction: "row", spacing: 2, children: situations.map((st) => (_jsx(Button, { variant: "contained", onClick: () => setSituation(st.value), sx: {
                            backgroundColor: st.value === situation ? "secondary.main" : "primary.main",
                            color: "white",
                            textTransform: "capitalize",
                            borderRadius: 0,
                        }, children: st.label }, st.value))) })) }), _jsx(BaseTableColumnFilters, { columns: columns, filters: filters, handleChangeFilters: handleChangeFilters, debouncedSetTriggerFetch: function () {
                    throw new Error("Function not implemented.");
                } }), _jsx(BaseDataTable, { rows: rows, columns: columns, loading: loading, disableColumnMenu: true, getRowId: (row) => row.id_checklist_movimentacao || Math.random(), onRowClick: (params) => handleRowClick(params.row), hideFooter: from === "patrimonio", rowHeight: 36, theme: theme }), _jsxs(Dialog, { fullScreen: true, open: Boolean(checklistSelected), onClose: () => {
                    setChecklistSelected(null);
                    dispatch(setRefresh(!refresh));
                }, children: [_jsxs(DialogTitle, { children: [_jsxs(Typography, { component: 'a', variant: "h6", color: "primary.main", href: `/patrimonios/${checklistSelected?.patrimonio?.id_patrimonio}`, children: [checklistSelected?.id_checklist_movimentacao, " -", " ", checklistSelected?.patrimonio_nome] }), _jsxs(Typography, { children: ["Situa\u00E7\u00E3o: ", renderSituation(checklistSelected)] })] }), _jsxs(DialogContent, { children: [_jsx(IconButton, { sx: { position: "absolute", top: 0, right: 0 }, color: "error", onClick: () => {
                                    setChecklistSelected(null);
                                    dispatch(setRefresh(!refresh));
                                }, "aria-label": "close", children: _jsx(CloseIcon, {}) }), checklistSelected && (_jsx(ChecklistView, { id_checklist: checklistSelected?.id_checklist_movimentacao || 0 }))] })] })] }));
};
export default ChecklistTable;
