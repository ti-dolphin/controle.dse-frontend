import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Card, CardContent, CircularProgress, Grid, Stack, Typography, } from "@mui/material";
import React from "react";
import OpportunityService from "../services/oportunidades/OpportunityService";
import { useDispatch } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { CheckListService } from "../services/patrimonios/ChecklistService";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import UpperNavigation from "../components/shared/UpperNavigation";
const AdminPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loadingReport, setLoadingReport] = React.useState(false);
    const [loadingChecklists, setLoadingChecklists] = React.useState(false);
    const [loadingItems, setLoadingItems] = React.useState(false);
    const [repportInfo, setRepportInfo] = React.useState(null);
    const [checklistVerificationInfo, setChecklistVerificationInfo] = React.useState(null);
    const [checklistItemsInfo, setChecklistItemsInfo] = React.useState(null);
    const [checklistEmailsInfo, setchecklistEmailsInfo] = React.useState(null);
    const handleBack = () => {
        navigate('/');
    };
    const verifyReport = async () => {
        setLoadingReport(true);
        try {
            const data = await OpportunityService.getReportInfo();
            setRepportInfo(data);
        }
        catch (e) {
            dispatch(setFeedback({ message: "Erro ao verificar relatório", type: "error" }));
        }
        finally {
            setLoadingReport(false);
        }
    };
    const verifyChecklists = async () => {
        setLoadingChecklists(true);
        try {
            const data = await CheckListService.verifyChecklistCreation();
            setChecklistVerificationInfo(data);
        }
        catch (e) {
            dispatch(setFeedback({ message: "Erro ao verificar checklists", type: "error" }));
        }
        finally {
            setLoadingChecklists(false);
        }
    };
    const verifyChecklistItems = async () => {
        setLoadingItems(true);
        try {
            const data = await CheckListService.verifyChecklistItems();
            setChecklistItemsInfo(data);
        }
        catch (e) {
            dispatch(setFeedback({
                message: "Erro ao verificar itens do checklist",
                type: "error",
            }));
        }
        finally {
            setLoadingItems(false);
        }
    };
    const verifyChecklistEmails = async () => {
        setLoadingItems(true);
        try {
            const data = await CheckListService.verifyChecklistEmails();
            console.log("data", data);
            setchecklistEmailsInfo(data);
        }
        catch (e) {
            dispatch(setFeedback({
                message: "Erro ao verificar emails do checklist",
                type: "error",
            }));
        }
        finally {
            setLoadingItems(false);
        }
    };
    const cardStyle = {
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
        minHeight: 150,
    };
    return (_jsxs(Box, { sx: { backgroundColor: "#f4f6f8", minHeight: "100vh" }, children: [_jsx(UpperNavigation, { handleBack: handleBack }), _jsxs(Box, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h5", fontWeight: 600, mb: 3, children: "Painel Administrativo" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { sx: cardStyle, children: _jsxs(CardContent, { children: [_jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", children: [_jsx(EmailIcon, { color: "primary", fontSize: "large" }), _jsx(Typography, { variant: "h6", children: "Relat\u00F3rio Semanal das Propostas" })] }), _jsx(Box, { mt: 2, children: _jsx(Button, { variant: "contained", fullWidth: true, onClick: verifyReport, disabled: loadingReport, children: loadingReport ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : ("Verificar") }) }), repportInfo && (_jsxs(Box, { mt: 2, children: [_jsxs(Typography, { color: "text.secondary", children: ["Emails enviados: ", repportInfo.succesfullEmails] }), _jsxs(Typography, { color: "text.secondary", children: ["Erros: ", repportInfo.failedEmails] })] }))] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { sx: cardStyle, children: _jsxs(CardContent, { children: [_jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", children: [_jsx(AssignmentTurnedInIcon, { color: "success", fontSize: "large" }), _jsx(Typography, { variant: "h6", children: "Cria\u00E7\u00E3o de Checklists" })] }), _jsx(Box, { mt: 2, children: _jsx(Button, { variant: "contained", color: "success", fullWidth: true, onClick: verifyChecklists, disabled: loadingChecklists, children: loadingChecklists ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : ("Verificar") }) }), checklistVerificationInfo && (_jsx(Box, { mt: 2, children: _jsxs(Typography, { color: "text.secondary", children: ["checklists criados:", " ", checklistVerificationInfo.checklistsCreated] }) }))] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { sx: cardStyle, children: _jsxs(CardContent, { children: [_jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", children: [_jsx(CheckCircleIcon, { color: "info", fontSize: "large" }), _jsx(Typography, { variant: "h6", children: "Itens do Checklist" })] }), _jsx(Box, { mt: 2, children: _jsx(Button, { variant: "contained", color: "info", fullWidth: true, onClick: verifyChecklistItems, disabled: loadingItems, children: loadingItems ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : ("Verificar") }) }), checklistItemsInfo && (_jsx(Box, { mt: 2, children: _jsxs(Typography, { color: "text.secondary", children: ["checklists com itens inseridos:", " ", checklistItemsInfo.checklistWithItemsInserted] }) }))] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { sx: cardStyle, children: _jsxs(CardContent, { children: [_jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", children: [_jsx(EmailIcon, { color: "info", fontSize: "large" }), _jsx(Typography, { variant: "h6", children: "Email dos checklists" })] }), _jsx(Box, { mt: 2, children: _jsx(Button, { variant: "contained", color: "info", fullWidth: true, onClick: verifyChecklistEmails, disabled: loadingItems, children: loadingItems ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : ("Verificar") }) }), checklistEmailsInfo && (_jsx(Box, { mt: 2, children: _jsxs(Typography, { color: "text.secondary", children: ["Emails do checklist enviados", " ", checklistEmailsInfo?.emailsSent] }) }))] }) }) })] })] })] }));
};
export default AdminPage;
