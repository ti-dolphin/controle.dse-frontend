import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { memo } from "react";
import { Table, TableBody, TableRow, TableCell, Typography, Paper, } from "@mui/material";
import { getDateStringFromISOstring } from "../../utils";
const DetailRow = ({ label, value }) => (_jsxs(TableRow, { sx: {
        height: 20,
    }, children: [_jsx(TableCell, { sx: {
                py: 0.25,
                pr: 1,
                borderBottom: "none",
            }, children: _jsxs(Typography, { color: "text.secondary", fontSize: 12, fontWeight: 600, sx: { lineHeight: "1.2" }, children: [label, ":"] }) }), _jsx(TableCell, { sx: {
                py: 0.25,
                borderBottom: "none",
            }, children: _jsx(Typography, { fontSize: 12, color: "text.primary", sx: { lineHeight: "1.2", fontWeight: 400 }, children: value || "-" }) })] }));
const RequisitionDetailsTable = ({ requisition, }) => {
    const rows = [
        {
            label: "Criada",
            value: requisition.data_criacao
                ? getDateStringFromISOstring(requisition.data_criacao)
                : undefined,
        },
        {
            label: "Atualizada em",
            value: requisition.data_alteracao
                ? getDateStringFromISOstring(requisition.data_alteracao)
                : undefined,
        },
        { label: "Atualizada por", value: requisition.alterado_por?.NOME },
        { label: "Requisitante", value: requisition.responsavel?.NOME },
        { label: "Gerente", value: requisition.gerente?.NOME },
        { label: "Tipo", value: requisition.tipo_requisicao?.nome_tipo },
    ];
    return (_jsx(Paper, { elevation: 0, sx: {
            p: 1,
            borderRadius: 2,
            backgroundColor: (theme) => theme.palette.mode === "light" ? "#f8f9fa" : "#1f1f1f",
        }, children: _jsx(Table, { size: "small", sx: {
                minWidth: "auto",
                "& td, & th": { border: 0 },
            }, children: _jsx(TableBody, { children: rows.map((row, index) => (_jsx(DetailRow, { label: row.label, value: row.value }, index))) }) }) }));
};
export default memo(RequisitionDetailsTable);
