import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
const BaseSearchInput = ({ onChange, showIcon, label, placeholder, styles }) => {
    return (_jsxs(Box, { component: "form", sx: {
            display: "flex",
            alignItems: "center",
            border: "2px solid",
            borderColor: "lightgray",
            borderRadius: 0,
            paddingX: 2,
            backgroundColor: "white",
            ...styles
        }, children: [showIcon && _jsx(SearchIcon, {}), _jsx("input", { type: "text", placeholder: placeholder || "Pesquisar...", "aria-label": label && label, onChange: onChange, onKeyDown: (e) => e.key === "Enter" && e.preventDefault(), style: {
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "1rem",
                    outline: "none",
                    minWidth: "200px",
                } })] }));
};
export default BaseSearchInput;
