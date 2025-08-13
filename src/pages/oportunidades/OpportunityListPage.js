import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import OpportunityTable from '../../components/oportunidades/OpportunityTable';
import { Box } from '@mui/material';
import UpperNavigation from '../../components/shared/UpperNavigation';
import { useNavigate } from 'react-router-dom';
const OpportunityListPage = () => {
    const navbarRef = React.useRef(null);
    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/");
    };
    return (_jsxs(Box, { sx: { height: "100vh", padding: 1 }, children: [_jsx(Box, { ref: navbarRef, children: _jsx(UpperNavigation, { handleBack: handleBack }) }), _jsx(Box, { sx: { height: `calc(100% - ${navbarRef.current?.offsetHeight}px)`, overflow: "hidden" }, children: _jsx(OpportunityTable, {}) })] }));
};
export default OpportunityListPage;
