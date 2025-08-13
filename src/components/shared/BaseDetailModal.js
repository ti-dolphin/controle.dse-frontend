import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Divider, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getDateStringFromDateObject } from "../../utils";
function detectType(value) {
    if (value instanceof Date)
        return "date";
    if (typeof value === "number")
        return "number";
    if (typeof value === "string")
        return "string";
    return "string";
}
export function BaseDetailModal({ open, onClose, columns, row, title, ref }) {
    if (!row)
        return null;
    function getValue(row, col) {
        const { field } = col;
        if (typeof col.valueGetter === "function") {
            const value = col.valueGetter(row[col.field], row, col, ref);
            if (detectType(value) === "date") {
                return getDateStringFromDateObject(value);
            }
            return value;
        }
        return row[field];
    }
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, sx: { display: 'flex', justifyContent: 'end' }, children: [_jsxs(DialogTitle, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'primary.main' }, children: [title || 'Detalhes', _jsx(IconButton, { onClick: onClose, children: _jsx(CloseIcon, {}) })] }), _jsx(DialogContent, { children: _jsx(Grid, { container: true, spacing: 2, children: columns.map((col) => (_jsxs(React.Fragment, { children: [_jsx(Grid, { item: true, xs: 5, children: _jsx(Typography, { variant: "body2", color: "text.secondary", fontWeight: 600, children: col.headerName }) }), _jsx(Grid, { item: true, xs: 7, children: _jsx(Typography, { variant: "body2", color: "text.primary", children: getValue(row, col) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Divider, {}) })] }, col.field))) }) })] }));
}
export default BaseDetailModal;
