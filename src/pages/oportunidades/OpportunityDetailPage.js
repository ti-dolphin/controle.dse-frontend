import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Grid, Paper, useTheme, } from "@mui/material";
import OpportunityDetailedForm from "../../components/oportunidades/OpportunityDetailedForm";
import OpportunityCommentList from "../../components/oportunidades/OpportunityCommentList";
import OpportunityAttachmentList from "../../components/oportunidades/OpportunityAttachmentList";
import UpperNavigation from "../../components/shared/UpperNavigation";
import { useNavigate, useParams } from "react-router-dom";
import OpportunityFollowerList from "../../components/oportunidades/OpportunityFollowerList";
const OpportunityDetailPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { CODOS } = useParams();
    const handleBack = () => {
        navigate("/oportunidades");
    };
    return (_jsxs(Box, { sx: {
            p: { xs: 1, sm: 1 },
            backgroundColor: theme.palette.background.default,
            minHeight: "100vh",
        }, children: [_jsx(UpperNavigation, { handleBack: handleBack }), _jsxs(Grid, { container: true, direction: "row", gap: 1, wrap: "wrap", children: [_jsx(OpportunityDetailedForm, {}), _jsxs(Grid, { container: true, direction: { xs: "column", md: "row" }, gap: 1, wrap: "nowrap", children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Paper, { elevation: 3, sx: { p: 2, borderRadius: 1, height: '100%' }, children: _jsx(OpportunityCommentList, {}) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Paper, { elevation: 3, sx: { p: 2, borderRadius: 1, height: "100%" }, children: _jsx(Box, { sx: { minHeight: 100 }, children: _jsx(OpportunityFollowerList, { CODOS: Number(CODOS) }) }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Paper, { elevation: 3, sx: { p: 2, borderRadius: 1, height: "100%" }, children: _jsx(Box, { sx: { minHeight: 100 }, children: _jsx(OpportunityAttachmentList, {}) }) }) })] })] })] }));
};
export default OpportunityDetailPage;
