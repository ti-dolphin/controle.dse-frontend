import { jsx as _jsx } from "react/jsx-runtime";
import { Box, IconButton, Typography } from '@mui/material';
import { getDateFromISOstring } from '../../utils';
import DeleteIcon from '@mui/icons-material/Delete';
const useMovementationColumns = (deletingMov, setDeletingMov, permissionToDelete) => {
    console.log("deletingMov", deletingMov);
    const columns = [
        {
            field: "id_movimentacao",
            headerName: "ID",
            flex: 0.4,
            renderCell: (params) => (_jsx(Box, { sx: {
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "center",
                }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "black", children: params.value }) })),
        },
        {
            field: "responsavel",
            headerName: "Responsável",
            flex: 0.6,
            valueGetter: (responsavel) => responsavel ? responsavel.NOME : "",
        },
        {
            field: "projeto",
            headerName: "Projeto",
            flex: 1.5,
            valueGetter: (projeto) => (projeto ? projeto.DESCRICAO : ""),
        },
        {
            field: "data",
            headerName: "Data",
            flex: 0.6,
            type: "date",
            valueGetter: (date) => (date ? getDateFromISOstring(date) : ""),
            // valueFormatter: (value: any) =>
            //   value ? getDateStringFromISOstring(value) : "",
        },
        {
            field: "actions",
            headerName: "",
            flex: 0.2,
            renderCell: (params) => (_jsx(Box, { sx: {
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "center",
                }, children: _jsx(IconButton, { disabled: !permissionToDelete, onClick: () => {
                        setDeletingMov(Number(params.row.id_movimentacao));
                    }, children: _jsx(DeleteIcon, { color: permissionToDelete ? "error" : "disabled" }) }) })),
        },
    ];
    return { columns };
};
export default useMovementationColumns;
