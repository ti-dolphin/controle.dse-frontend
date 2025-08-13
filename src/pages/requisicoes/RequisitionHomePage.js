import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@mui/material";
import RequisitionListPage from "./RequisitionListPage/RequisitionListPage";
const RequisitionHomePage = () => {
    return (_jsx(Box, { sx: { minHeight: "100vh", width: "100%" }, children: _jsx(RequisitionListPage, {}) }));
};
export default RequisitionHomePage;
