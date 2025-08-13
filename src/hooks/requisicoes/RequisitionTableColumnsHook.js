import { jsx as _jsx } from "react/jsx-runtime";
import { formatCurrency, getDateFromISOstring } from "../../utils";
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMemo } from "react";
export function useRequisitionColumns(changeSelectedRow, _gridRef) {
    const columns = useMemo(() => [
        {
            field: "ID_REQUISICAO",
            headerName: "ID",
            flex: 0.2,
        },
        {
            field: "DESCRIPTION",
            headerName: "Descrição",
            flex: 1.5,
            renderCell: (params) => {
                return (_jsx(Box, { sx: {
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "center",
                    }, children: _jsx(Typography, { fontSize: "12px", fontWeight: "bold", color: "text.primary", children: params.value }) }));
            },
        },
        {
            field: "projeto",
            headerName: "Projeto",
            flex: 0.5,
            valueGetter: (project) => {
                return project.DESCRICAO;
            },
        },
        {
            field: "responsavel",
            headerName: "Requisitante",
            flex: 1,
            valueGetter: (user) => {
                return user.NOME;
            },
        },
        {
            field: "gerente",
            headerName: "Gerente",
            flex: 1,
            valueGetter: (user) => {
                return user.NOME;
            },
        },
        {
            field: "responsavel_projeto",
            headerName: "Responsável Projeto",
            flex: 1,
            valueGetter: (user) => {
                return user.NOME;
            },
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.5,
            valueGetter: (status) => {
                return status ? status.nome : "";
            },
        },
        // {
        //   field: "data_criacao",
        //   headerName: "Data de Criação",
        //   flex: 0.5,
        //   type: "date",
        //   valueGetter: (value) => {
        //     return getDateFromISOstring(value);
        //   },
        // },
        {
            field: "custo_total",
            headerName: "Custo Total",
            flex: 0.4,
            type: "number",
            renderCell: (params) => {
                return (_jsx(Box, { sx: {
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "center",
                    }, children: formatCurrency(Number(params.value)) }));
            },
        },
        {
            field: "actions",
            headerName: "",
            flex: 0.5,
            renderCell: (params) => {
                const { row } = params;
                return (_jsx(Box, { sx: { zIndex: 30 }, children: _jsx(IconButton, { onClick: () => {
                            changeSelectedRow(row);
                        }, sx: { color: "primary.main" }, children: _jsx(VisibilityIcon, {}) }) }));
            },
        },
    ], []);
    const secondaryColumns = useMemo(() => [
        {
            field: "criado_por",
            headerName: "Criado por",
            flex: 1,
            valueGetter: (user) => {
                return user.NOME;
            },
        },
        {
            field: "alterado_por",
            headerName: "Alterado por",
            flex: 1,
            valueGetter: (user) => {
                return user.NOME;
            },
        },
        {
            field: "OBSERVACAO",
            headerName: "Observação",
            flex: 1,
        },
        {
            field: "data_alteracao",
            headerName: "Data de Alteração",
            flex: 1,
            type: "date",
            valueGetter: (value) => {
                return getDateFromISOstring(value);
            },
        },
        {
            field: 'data_criacao',
            headerName: 'Data de Criação',
            flex: 1,
            type: 'date',
            valueGetter: (value) => {
                return getDateFromISOstring(value);
            }
        },
        {
            field: "tipo_requisicao",
            headerName: "Tipo",
            flex: 1,
            valueGetter: (requisitionType) => {
                return requisitionType.nome_tipo;
            },
        },
        {
            field: "gerente",
            headerName: "Gerente",
            flex: 1,
            valueGetter: (user) => {
                return user.NOME;
            },
        },
    ], []);
    return { columns, secondaryColumns };
}
