import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useState } from 'react';
import { useOpportunityColumns } from '../../hooks/oportunidades/useOpportunityColumns';
import { useDispatch, useSelector } from 'react-redux';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import BaseTableToolBar from '../shared/BaseTableToolBar';
import { setLoading, setRows, setSearchTerm } from '../../redux/slices/oportunidades/opportunityTableSlice';
import { debounce } from 'lodash';
import BaseDataTable from '../shared/BaseDataTable';
import { Box, Button, IconButton, Paper, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { setCreating } from '../../redux/slices/oportunidades/opportunitySlice';
import OpportunityFormModal from './OpportunityFormModal';
import { useNavigate } from 'react-router-dom';
import BaseTableColumnFilters from '../shared/BaseTableColumnFilters';
import { useOpportunityFilters } from '../../hooks/oportunidades/useOpportunityFilters';
import { setFeedback } from '../../redux/slices/feedBackSlice';
const OpportunityTable = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const { loading, rows, searchTerm } = useSelector((state) => state.opportunityTable);
    const { columns } = useOpportunityColumns();
    const theme = useTheme();
    const toolbarRef = React.useRef(null);
    const [toolbarHeight, setToolbarHeight] = useState(0);
    const [columnFiltersHeight, setColumnFiltersHeight] = useState(0);
    const columnFiltersRef = React.useRef(null);
    const { filters, handleChangeFilters, buildPrismaFilters, clearFilters } = useOpportunityFilters();
    const changeSearchTerm = (event) => {
        dispatch(setSearchTerm(event.target.value));
    };
    const handleChangeSearchTerm = debounce(changeSearchTerm, 500);
    const openFormModal = () => {
        dispatch(setCreating(true));
    };
    const navigateToOppDetails = (id) => {
        navigate(`/oportunidades/${id}`);
    };
    const handleCleanFilters = () => {
        clearFilters();
    };
    const fetchData = useCallback(async () => {
        if (user) {
            dispatch(setLoading(true));
            try {
                const prismaFilters = buildPrismaFilters(filters);
                const data = await OpportunityService.getMany({
                    user: user,
                    searchTerm,
                    filters: prismaFilters,
                    finalizados: false,
                });
                dispatch(setRows(data));
                dispatch(setLoading(false));
            }
            catch (e) {
                dispatch(setLoading(false));
                setFeedback({
                    message: `Erro ao buscar oportunidades: ${e.message}`,
                    type: "error",
                });
            }
        }
    }, [dispatch, searchTerm, filters]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    useEffect(() => {
        if (toolbarRef.current) {
            setToolbarHeight(toolbarRef.current.clientHeight);
        }
        if (columnFiltersRef.current) {
            setColumnFiltersHeight(columnFiltersRef.current.clientHeight);
        }
        //log heihgts
    }, [toolbarRef.current, columnFiltersRef.current]);
    return (_jsxs(Box, { sx: { height: "100%" }, children: [_jsxs(Paper, { elevation: 2, children: [_jsx(Box, { ref: toolbarRef, children: _jsxs(BaseTableToolBar, { handleChangeSearchTerm: handleChangeSearchTerm, children: [_jsx(IconButton, { onClick: openFormModal, sx: {
                                        bgcolor: "secondary.main",
                                        color: "white",
                                        borderRadius: "50%",
                                        "&:hover": {
                                            bgcolor: "secondary.main",
                                        },
                                    }, children: _jsx(AddIcon, {}) }), _jsx(Button, { variant: 'contained', onClick: handleCleanFilters, children: "Limpar filtros" }), _jsx(OpportunityFormModal, {})] }) }), _jsx(Box, { ref: columnFiltersRef, children: _jsx(BaseTableColumnFilters, { columns: columns, filters: filters, handleChangeFilters: handleChangeFilters, debouncedSetTriggerFetch: function () {
                                throw new Error("Function not implemented.");
                            } }) })] }), _jsx(Paper, { elevation: 2, sx: {
                    height: `calc(92vh - ${toolbarHeight}px - ${columnFiltersHeight}px)`,
                    overflow: "hidden",
                }, children: _jsx(BaseDataTable, { rows: rows, columns: columns, loading: loading, disableColumnMenu: true, disableColumnFilter: true, rowHeight: 36, onRowClick: (params) => navigateToOppDetails(Number(params.id)), 
                    // onRowClick={(params) => navigateToRequisitionDetails(params)}
                    getRowId: (row) => row.CODOS, theme: theme }) })] }));
};
export default OpportunityTable;
