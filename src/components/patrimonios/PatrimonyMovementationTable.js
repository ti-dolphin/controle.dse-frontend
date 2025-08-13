import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import MovementationService from '../../services/patrimonios/MovementationService';
import { useProjectOptions } from '../../hooks/projectOptionsHook';
import { useUserOptions } from '../../hooks/useUserOptions';
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography, useTheme } from '@mui/material';
import useMovementationColumns from '../../hooks/patrimonios/useMovementationColumns';
import BaseDataTable from '../shared/BaseDataTable';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import { BaseAddButton } from '../shared/BaseAddButton';
import { useMovementationPermissions } from '../../hooks/patrimonios/useMovementationPermissions';
const PatrimonyMovementationTable = () => {
    const theme = useTheme();
    const { id_patrimonio } = useParams();
    const [rows, setRows] = React.useState([]);
    const { projectOptions } = useProjectOptions();
    const { userOptions } = useUserOptions();
    const [creating, setCreating] = React.useState(false);
    const [deletingMov, setDeletingMov] = React.useState(null);
    const { permissionToCreateNew, permissionToDelete } = useMovementationPermissions(rows);
    const { columns } = useMovementationColumns(deletingMov, setDeletingMov, permissionToDelete);
    const [formData, setFormData] = React.useState({
        id_patrimonio: Number(id_patrimonio),
        id_projeto: 0,
        id_responsavel: 0
    });
    const dispatch = useDispatch();
    const deleteMov = async () => {
        try {
            if (!deletingMov)
                return;
            await MovementationService.delete(deletingMov);
            dispatch(setFeedback({ message: 'Movimentação deletada com sucesso', type: 'success' }));
            setDeletingMov(null);
            setRows(rows.filter((row) => row.id_movimentacao !== deletingMov));
        }
        catch (error) {
            dispatch(setFeedback({ message: 'Erro ao deletar movimentação', type: 'error' }));
        }
    };
    const createMov = async () => {
        try {
            const newMov = await MovementationService.create({ ...formData });
            dispatch(setFeedback({ message: 'Movimentação criada com sucesso', type: 'success' }));
            setCreating(false);
            setRows([newMov, ...rows]);
        }
        catch (error) {
            dispatch(setFeedback({ message: 'Erro ao criar movimentação', type: 'error' }));
        }
    };
    const fetchData = async () => {
        try {
            const data = await MovementationService.getMany({
                from: 'movimentacoes',
                id_patrimonio: Number(id_patrimonio)
            });
            setRows(data);
        }
        catch (error) {
            dispatch(setFeedback({ message: 'Erro ao buscar movimentações', type: 'error' }));
        }
    };
    useEffect(() => {
        fetchData();
    }, [dispatch, id_patrimonio]);
    return (_jsxs(Box, { children: [_jsx(Box, { sx: { width: "100%", height: "34px" }, children: _jsxs(Stack, { direction: "row", gap: 2, children: [_jsx(Typography, { variant: "h6", color: "primary.main", gutterBottom: true, children: "Movimenta\u00E7\u00F5es" }), permissionToCreateNew && (_jsx(BaseAddButton, { handleOpen: () => setCreating(true), text: "Adicionar movimenta\u00E7\u00E3o" }))] }) }), _jsx(Box, { sx: { height: 300 }, children: _jsx(BaseDataTable, { rows: rows, columns: columns, disableColumnMenu: true, getRowId: (row) => row.id_movimentacao, hideFooter: true, rowHeight: 36, theme: theme }) }), _jsxs(Dialog, { open: creating, onClose: () => setCreating(false), children: [_jsx(DialogTitle, {}), _jsx(DialogContent, { sx: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            gap: 2,
                            width: {
                                xs: "100%",
                                sm: "500px",
                                md: "400px",
                            },
                        }, children: _jsx(MovimentationForm, { formData: formData, setFormData: setFormData, onCancel: () => setCreating(false), onConfirm: createMov, projectOptions: projectOptions, userOptions: userOptions }) })] }), _jsx(BaseDeleteDialog, { open: deletingMov !== null, onConfirm: deleteMov, onCancel: () => setDeletingMov(null) })] }));
};
function MovimentationForm(props) {
    const { formData, setFormData, onCancel, onConfirm, projectOptions, userOptions } = props;
    return (_jsxs(Stack, { spacing: 2, alignItems: "center", sx: { width: '100%' }, children: [_jsx(Typography, { variant: "h6", color: "primary.main", children: "Nova moviementa\u00E7\u00E3o" }), _jsx(Autocomplete, { options: projectOptions, getOptionLabel: (option) => option.name, getOptionKey: (option) => option.id, value: projectOptions.find((option) => option.id === formData.id_projeto), slotProps: {
                    paper: {
                        style: {
                            fontSize: "small",
                        },
                    },
                }, onChange: (_event, newValue) => {
                    setFormData({ ...formData, id_projeto: newValue ? newValue.id : 0 });
                }, fullWidth: true, renderInput: (params) => _jsx(TextField, { ...params, label: "Projeto" }) }), _jsx(Autocomplete, { options: userOptions, getOptionLabel: (option) => option.name, getOptionKey: (option) => option.id, value: userOptions.find((option) => option.id === formData.id_responsavel), onChange: (_event, newValue) => {
                    setFormData({
                        ...formData,
                        id_responsavel: newValue ? newValue.id : 0,
                    });
                }, slotProps: {
                    paper: {
                        style: {
                            fontSize: "small",
                        },
                    },
                }, fullWidth: true, renderInput: (params) => _jsx(TextField, { ...params, label: "Respons\u00E1vel" }) }), _jsxs(Stack, { direction: "row", spacing: 2, children: [_jsx(Button, { variant: "contained", color: "error", onClick: onCancel, children: "Cancelar" }), _jsx(Button, { variant: "contained", onClick: onConfirm, children: "Cadastrar" })] })] }));
}
export default PatrimonyMovementationTable;
