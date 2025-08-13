import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box, Stack, IconButton, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import PatrimonyMovementationTable from '../../components/patrimonios/PatrimonyMovementationTable';
import PatrimonyForm from '../../components/patrimonios/PatrimonyForm';
import ChecklistTable from './ChecklistTable';
import UpperNavigation from '../../components/shared/UpperNavigation';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
const PatrimonyDetailPage = () => {
    const navigate = useNavigate();
    const [fullScreenChecklist, setFullScreenChecklist] = React.useState(false);
    const handleBack = () => {
        navigate("/patrimonios");
    };
    return (_jsxs(Box, { children: [_jsx(UpperNavigation, { handleBack: handleBack }), _jsxs(Grid, { sx: { p: 2 }, container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 3, sx: { p: 1 }, children: [_jsx(Typography, { variant: "h6", color: "primary.main", gutterBottom: true, children: "Patrim\u00F4nio" }), _jsx(PatrimonyForm, {}), _jsx(Box, {})] }) }), _jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(Paper, { elevation: 3, sx: { p: 1, }, children: _jsx(PatrimonyMovementationTable, {}) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Paper, { elevation: 3, sx: { p: 1 }, children: [_jsxs(Stack, { direction: "row", alignItems: "center", gap: 2, children: [_jsx(Typography, { variant: "h6", color: "primary.main", gutterBottom: true, children: "Checklists" }), _jsx(IconButton, { onClick: () => setFullScreenChecklist(true), children: _jsx(FullscreenIcon, {}) })] }), _jsx(ChecklistTable, {})] }) })] }), _jsxs(Dialog, { fullScreen: true, open: fullScreenChecklist, onClose: () => setFullScreenChecklist(false), children: [_jsx(DialogTitle, { children: _jsxs(Stack, { direction: "row", alignItems: "center", gap: 2, children: [_jsx(Typography, { variant: "h6", color: "primary.main", gutterBottom: true, children: "Checklists" }), _jsx(Button, { onClick: () => setFullScreenChecklist(false), variant: "contained", color: "error", children: "Fechar" })] }) }), _jsx(DialogContent, { children: _jsx(ChecklistTable, {}) })] })] }));
};
export default PatrimonyDetailPage;
