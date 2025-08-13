import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Checkbox, Typography } from "@mui/material";
export const useQuoteItemColumns = (handleUpdateUnavailable, blockFields) => {
    const columns = [
        {
            field: "produto_descricao",
            headerName: "Descrição do Produto",
            flex: 1.5,
            editable: false,
            renderCell: (params) => (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "black", children: params.value }) })),
        },
        {
            field: "produto_unidade",
            headerName: "Unidade",
            flex: 0.4,
            editable: false,
            renderCell: (params) => (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "black", children: params.value }) })),
        },
        {
            field: "preco_unitario",
            headerName: "Preço Unitário",
            type: "number",
            flex: 0.6,
            editable: true,
            renderCell: (params) => (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "black", children: params.value }) })),
        },
        {
            field: "quantidade_solicitada",
            headerName: "Qtde. Solicitada",
            type: "number",
            flex: 0.7,
            editable: false,
        },
        {
            field: "quantidade_cotada",
            headerName: "Qtde. Cotada",
            type: "number",
            flex: 0.7,
            editable: true,
        },
        {
            field: "ICMS",
            headerName: "ICMS (%)",
            type: "number",
            flex: 0.5,
            editable: true,
        },
        {
            field: "IPI",
            headerName: "IPI (%)",
            type: "number",
            flex: 0.5,
            editable: true,
        },
        {
            field: "ST",
            headerName: "ST (%)",
            type: "number",
            flex: 0.5,
            editable: true,
        },
        {
            field: "subtotal",
            headerName: "Subtotal",
            flex: 0.5,
            editable: false,
            renderCell: (params) => (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "black", children: params.value }) })),
        },
        {
            field: "observacao",
            headerName: "Observação",
            flex: 1,
            editable: true,
        },
        {
            field: "indisponivel",
            headerName: "Indisponivel",
            flex: 0.5,
            editable: false,
            renderCell: (params) => {
                return (_jsx(Box, { sx: { display: "flex", alignItems: "center" }, children: _jsx(Checkbox, { disabled: blockFields, checked: Number(params.value) === 1 ? true : false, onChange: (changeParams) => handleUpdateUnavailable(changeParams, Number(params.id)), inputProps: { "aria-label": "Indisponível" } }) }));
            },
        },
    ];
    return { columns };
};
