import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { debounce } from "lodash";
function BaseTableColumnFiltersComponent({ columns, filters, handleChangeFilters, debouncedSetTriggerFetch, handleCleanFilters, }) {
    const [localFilters, setLocalFilters] = useState({});
    const debouncedSync = useMemo(() => debounce((field, value) => {
        handleChangeFilters({ target: { value: value === "" ? '' : value } }, field);
        debouncedSetTriggerFetch();
    }, 600), [handleChangeFilters, debouncedSetTriggerFetch]);
    useEffect(() => {
        setLocalFilters({ ...filters });
    }, [filters]);
    return (_jsxs(Box, { sx: {
            display: "flex",
            flexDirection: "column",
            gap: 1,
            padding: 1,
        }, children: [handleCleanFilters && (_jsx(Box, { sx: { width: "100%", display: "flex", justifyContent: "flex-end" }, children: _jsx(Button, { variant: "contained", onClick: handleCleanFilters, color: "primary", sx: { borderRadius: 0 }, children: "Limpar filtros" }) })), _jsx(Stack, { direction: "row", gap: 0.5, children: columns.map((col) => {
                    if (col.field === "actions") {
                        return _jsx(Box, { sx: { flex: col.flex || 1 } }, col.field);
                    }
                    return (_jsx(Box, { component: "form", sx: {
                            display: "flex",
                            flex: col.flex || 1,
                            minWidth: 0,
                            alignItems: "center",
                            border: "2px solid",
                            borderColor: "lightgray",
                            borderRadius: 0,
                            padding: 0.2,
                        }, children: _jsx("input", { type: col.type || "text", value: localFilters[col.field] || "", placeholder: col.headerName || "Pesquisar...", onKeyDown: (e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    debouncedSync(col.field, e.target.value);
                                }
                            }, onChange: (e) => {
                                setLocalFilters((prev) => ({
                                    ...prev,
                                    [col.field]: e.target.value,
                                }));
                                debouncedSync(col.field, e.target.value);
                            }, style: {
                                minWidth: 0,
                                width: "100%",
                                borderRadius: "0",
                                height: 30,
                                padding: 6,
                                border: "none",
                                outline: "none",
                                fontSize: "small",
                            } }) }, col.field));
                }) })] }));
}
const BaseTableColumnFilters = React.memo(BaseTableColumnFiltersComponent);
export default BaseTableColumnFilters;
