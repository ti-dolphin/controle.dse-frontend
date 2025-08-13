import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from "@mui/material";
import BaseSearchInput from "./BaseSearchInput";
import { useSelector } from "react-redux";
const BaseTableToolBar = ({ handleChangeSearchTerm, children, }) => {
    const searchTerm = useSelector((state) => state.requisitionTable.searchTerm);
    return (_jsxs(Box, { sx: {
            width: "100%",
            display: "flex",
            gap: 1,
            justifyContent: "start",
            alignItems: "center",
            padding: 1,
            backgroundColor: "white",
            borderRadius: "0",
            border: "1px solid lightgray",
        }, children: [_jsx(BaseSearchInput, { showIcon: true, onChange: handleChangeSearchTerm, value: searchTerm }), children] }));
};
export default BaseTableToolBar;
