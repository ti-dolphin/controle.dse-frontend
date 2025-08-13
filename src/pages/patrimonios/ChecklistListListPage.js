import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import ChecklistTable from './ChecklistTable';
import { Box } from '@mui/material';
import UpperNavigation from '../../components/shared/UpperNavigation';
const ChecklistListPage = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/patrimonios");
    };
    return (_jsxs(Box, { sx: { height: "100vh", width: "100%" }, children: [_jsx(UpperNavigation, { handleBack: handleBack }), _jsx(Box, { sx: { height: "93%" }, children: _jsx(ChecklistTable, {}) })] }));
};
export default ChecklistListPage;
