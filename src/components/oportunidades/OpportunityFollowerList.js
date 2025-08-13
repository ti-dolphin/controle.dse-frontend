import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemSecondaryAction, Stack, TextField, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import { ProjectService } from '../../services/ProjectService';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import AddIcon from '@mui/icons-material/Add';
import { useUserOptions } from '../../hooks/useUserOptions';
import CloseIcon from '@mui/icons-material/Close';
const OpportunityFollowerList = ({ CODOS, ID_PROJETO }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [followers, setFollowers] = React.useState([]);
    const [followerBeingDeleted, setFollowerBeingDeleted] = React.useState(null);
    const [addingFollower, setAddingFollower] = React.useState(false);
    const [selectedFollower, setSelectedFollower] = React.useState(null);
    const [opp, setOpp] = useState();
    const { userOptions } = useUserOptions();
    const handleDeleteFollower = () => {
        if (!user)
            return;
        if (!followerBeingDeleted)
            return;
        const { PERM_ADMINISTRADOR } = user;
        try {
            if (PERM_ADMINISTRADOR === 1) {
                ProjectService.deleteFollower(followerBeingDeleted.id_seguidor_projeto, followerBeingDeleted.id_projeto);
                setFollowers(followers.filter((follower) => follower.id_seguidor_projeto !==
                    followerBeingDeleted.id_seguidor_projeto));
                setFollowerBeingDeleted(null);
                dispatch(setFeedback({
                    message: "Seguidor excluido com sucesso",
                    type: "success",
                }));
            }
        }
        catch (err) {
            dispatch(setFeedback({
                message: `Erro ao excluir seguidor: ${err.message}`,
                type: "error",
            }));
        }
    };
    const handleAddFollower = async () => {
        if (!selectedFollower || !opp)
            return;
        try {
            const follower = await ProjectService.addFollower(Number(opp.ID_PROJETO), Number(selectedFollower.id));
            setFollowers([...followers, follower]);
            setSelectedFollower(null);
            setAddingFollower(false);
        }
        catch (err) {
            dispatch(setFeedback({
                message: `Erro ao adicionar seguidor: ${err.message}`,
                type: "error",
            }));
        }
    };
    const fetchData = async () => {
        if (!CODOS && !ID_PROJETO)
            return;
        const opp = await OpportunityService.getById(Number(CODOS));
        const project = await ProjectService.getById(Number(Number(opp.ID_PROJETO)));
        const { ID } = project;
        const followers = await ProjectService.getFollowers(ID);
        setFollowers(followers);
        setOpp(opp);
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (_jsxs(Box, { children: [_jsxs(Stack, { direction: "row", alignItems: "center", gap: 1, children: [_jsx(Typography, { variant: "h6", color: "primary.main", fontWeight: "bold", children: "Seguidores" }), _jsx(Tooltip, { title: "Adicionar Seguidor", children: _jsx(IconButton, { onClick: () => setAddingFollower(true), sx: {
                                backgroundColor: "primary.main",
                                color: "white",
                                height: 30,
                                width: 30,
                                "&:hover": {
                                    backgroundColor: "primary.dark",
                                },
                            }, children: _jsx(AddIcon, {}) }) })] }), _jsx(List, { sx: {
                    dislpay: "flex",
                    flexDirection: "column",
                    gap: 1,
                }, children: followers.map((follower) => (_jsxs(ListItem, { sx: {
                        backgroundColor: "white",
                        border: "1px solid lightgray",
                        mb: 1,
                        height: 30,
                        borderRadius: 1,
                        padding: 1,
                    }, children: [_jsx(Typography, { sx: {
                                textTransform: "capitalize",
                                fontSize: 14,
                                fontWeight: "semibold",
                                color: "text.secondary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: { xs: "100%", md: "50%" },
                            }, children: follower.pessoa.NOME }), _jsx(ListItemSecondaryAction, { children: _jsx(IconButton, { onClick: () => setFollowerBeingDeleted(follower), color: "error", children: _jsx(DeleteIcon, {}) }) })] }, follower.id_seguidor_projeto))) }), _jsx(BaseDeleteDialog, { open: Boolean(followerBeingDeleted), onConfirm: handleDeleteFollower, onCancel: () => setFollowerBeingDeleted(null) }), _jsxs(Dialog, { open: addingFollower, children: [_jsx(DialogTitle, { children: _jsx(Typography, { variant: "h6", fontWeight: "bold", color: "primary.main", children: "Adicionar Seguidor" }) }), _jsxs(DialogContent, { sx: {
                            minWidth: 300,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }, children: [_jsx(IconButton, { onClick: () => setAddingFollower(false), color: "error", sx: { position: "absolute", top: 0, right: 0 }, children: _jsx(CloseIcon, {}) }), _jsx(Autocomplete, { sx: { mt: 2 }, fullWidth: true, renderInput: (params) => _jsx(TextField, { ...params, label: "Seguidor" }), slotProps: {
                                    popper: { sx: { fontSize: 12 } },
                                    paper: { sx: { fontSize: 12 } },
                                }, value: selectedFollower || { id: 0, name: "-" }, onChange: (_event, newValue) => setSelectedFollower(newValue), getOptionKey: (option) => option.id, getOptionLabel: (option) => option.name, options: userOptions }), _jsx(Button, { variant: "contained", onClick: handleAddFollower, children: "Adicionar seguidor" })] })] })] }));
};
export default OpportunityFollowerList;
