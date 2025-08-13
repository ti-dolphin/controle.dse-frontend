import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Typography } from "@mui/material";
import { getDateFromISOstring } from "../../utils";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
export const useOpportunityColumns = () => {
    const columns = [
        {
            field: "CODOS",
            headerName: "Nº OS",
            flex: 0.8,
            depth: 0,
            renderCell: (params) => (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "primary.main", children: params.value }) })),
        },
        {
            field: "ID_PROJETO",
            headerName: "Projeto",
            flex: 0.6,
            depth: 0,
            renderCell: (params) => (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "text.primary", children: params.value }) })),
        },
        {
            field: "adicional",
            headerName: "Adicional",
            flex: 0.7,
            valueGetter: (adicional) => adicional.NUMERO,
            depth: 1,
            lastChildKey: 'NUMERO',
            renderCell: (params) => (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "text.primary", children: params.value }) })),
        },
        {
            field: "NOME",
            headerName: "Descrição",
            flex: 2,
            depth: 0,
            renderCell: (params) => (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "text.primary", children: params.value }) })),
        },
        {
            field: "cliente",
            headerName: "Cliente",
            depth: 1,
            lastChildKey: 'NOMEFANTASIA',
            valueGetter: (client) => client.NOMEFANTASIA || "", // ajusta de acordo com sua estrutura
            flex: 1.5,
        },
        {
            field: "projeto",
            headerName: "Projeto",
            depth: 1,
            lastChildKey: 'DESCRICAO',
            valueGetter: (projeto) => projeto?.DESCRICAO || "",
            flex: 1,
        },
        {
            field: "responsavel",
            headerName: "Responsável",
            valueGetter: (responsable) => responsable?.NOME || "",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            type: "number",
            depth: 1,
            lastChildKey: 'NOME',
            flex: 0.75,
            valueGetter: (status) => status.NOME || "", // ajusta de acordo com sua estrutura
        },
        {
            field: "DATASOLICITACAO",
            headerName: "Solicitação",
            type: "date",
            depth: 0,
            flex: 1,
            valueGetter: (value) => {
                return getDateFromISOstring(value);
            },
        },
        {
            field: "DATAENTREGA",
            headerName: "Fechamento",
            type: "date",
            flex: 1,
            valueGetter: (value) => {
                return getDateFromISOstring(value);
            },
        },
        {
            field: "DATAINICIO",
            headerName: "Início",
            type: "date",
            flex: 1,
            valueGetter: (value) => {
                return getDateFromISOstring(value);
            },
        },
        {
            field: 'DATAINTERACAO',
            headerName: 'Interação',
            flex: 1,
            sortable: true,
            type: "date",
            valueGetter: (value) => {
                return getDateFromISOstring(value);
            }
        },
        {
            field: "VALOR_TOTAL",
            headerName: "Valor Total",
            type: "number",
            flex: 1,
            depth: 0,
            align: "right",
            headerAlign: "right",
            valueGetter: (value) => value
                ? `R$ ${Number(value).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}`
                : "",
        },
        {
            field: 'situacao',
            headerName: 'Situação',
            flex: 0.5,
            sortable: true,
            valueParser: (value) => {
                const valueOrderMap = {
                    expirada: 1,
                    expirando: 2,
                    ativa: 3,
                };
                return valueOrderMap[value];
            },
            renderCell: (params) => {
                const iconMap = {
                    expirada: _jsx(ErrorIcon, { color: "error" }),
                    expirando: _jsx(InfoIcon, { color: "warning" }),
                    ativa: _jsx(CheckCircleIcon, { color: "success" }),
                };
                return _jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: iconMap[params.value] });
            },
        }
    ];
    return { columns };
};
