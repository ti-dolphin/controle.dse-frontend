import { jsx as _jsx } from "react/jsx-runtime";
import { Box, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { setPatrimonyBeingDeleted } from "../../redux/slices/patrimonios/PatrimonyTableSlice";
export const usePatMovementationColumns = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const permissionToDelete = Number(user?.PERM_ADMINISTRADOR) === 1;
    const handleDeleteClick = (row) => {
        dispatch(setPatrimonyBeingDeleted(row));
    };
    const columns = [
        {
            field: "id_patrimonio",
            headerName: "ID",
            type: "number",
            flex: 0.2,
            renderCell: (params) => (_jsx(Box, { sx: {
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "center",
                }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "black", children: params.value }) })),
        },
        {
            field: "patrimonio_nserie",
            headerName: "Nº Série",
            flex: 0.6,
            renderCell: (params) => (_jsx(Box, { sx: {
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "start",
                }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "black", children: params.value }) })),
        },
        {
            field: "patrimonio_nome",
            headerName: "Patrimônio",
            flex: 0.6,
            renderCell: (params) => (_jsx(Box, { sx: {
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "start",
                }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "black", children: params.value }) })),
        },
        {
            field: "patrimonio_descricao",
            headerName: "Descrição",
            flex: 1.4,
        },
        {
            field: "patrimonio_tipo",
            headerName: "Tipo",
            flex: 0.3,
            valueGetter: (type) => type.nome_tipo || "N/A",
        },
        {
            field: "patrimonio_valor_compra",
            headerName: "Valor compra",
            type: "number",
            valueFormatter: (value) => value ? `R$ ${Number(value).toFixed(2)}` : `R$ 0.00`,
            flex: 0.5,
        },
        {
            field: "projeto",
            headerName: "Projeto",
            valueGetter: (projeto) => projeto.DESCRICAO || "N/A",
            flex: 1,
        },
        {
            field: "responsavel",
            headerName: "Responsável",
            width: 200,
            valueGetter: (user) => user.NOME || "N/A",
            flex: 1,
        },
        {
            field: "gerente",
            headerName: "Gerente",
            width: 200,
            valueGetter: (user) => user.NOME || "N/A",
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Ações',
            type: 'actions',
            renderCell: (params) => {
                return (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(IconButton, { disabled: !permissionToDelete, children: _jsx(DeleteIcon, { color: permissionToDelete ? "error" : "disabled", onClick: () => handleDeleteClick(params.row) }) }) }));
            }
        }
    ];
    return { columns };
};
