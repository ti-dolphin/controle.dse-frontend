import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { CheckListService } from "../../services/patrimonios/ChecklistService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import ChecklistItemCard from "./ChecklistItemCard";
import { useChecklistPermission } from "../../hooks/patrimonios/useChecklistPermission";
import { updateSingleRow } from "../../redux/slices/patrimonios/ChecklistTableSlice";
const ChecklistView = ({ id_checklist }) => {
    const dispatch = useDispatch();
    const [checklist, setChecklist] = useState({});
    const [items, setItems] = useState([]);
    // const [loading, setLoading] = useState(false);
    const { permissionToFullfill, permissionToAprove } = useChecklistPermission(checklist);
    const updateSingleItem = (item, id_item_checklist_movimentacao) => {
        let updatedItem = items.find((item) => item.id_item_checklist_movimentacao === id_item_checklist_movimentacao);
        if (!updatedItem)
            return;
        updatedItem = { ...updatedItem, ...item };
        const updatedItems = items.map((item) => {
            if (item.id_item_checklist_movimentacao === id_item_checklist_movimentacao) {
                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };
    const validateItems = () => {
        if (!items.find((item) => !item.arquivo || item.arquivo.length === 0)) {
            return true;
        }
        return false;
    };
    const concludeChecklist = async () => {
        if (!checklist)
            return;
        const valid = validateItems();
        if (!valid) {
            dispatch(setFeedback({
                message: "Todos os itens devem ter um arquivo anexado!",
                type: "error",
            }));
            return;
        }
        try {
            const { id_checklist_movimentacao } = checklist;
            const updatedChecklist = await CheckListService.update(Number(id_checklist_movimentacao), { aprovado: false, realizado: true });
            setChecklist(updatedChecklist);
            //update checklist row on the table
            dispatch(updateSingleRow(updatedChecklist));
            dispatch(setFeedback({
                message: "Checklist foi concluído, aguardar aprovação!",
                type: "success",
            }));
        }
        catch (e) {
            dispatch(setFeedback({
                message: `Erro ao concluir checklist: ${e.message}`,
                type: "error",
            }));
        }
    };
    const aproveChecklist = async () => {
        if (!checklist)
            return;
        try {
            const { id_checklist_movimentacao } = checklist;
            const updatedChecklist = await CheckListService.update(Number(id_checklist_movimentacao), { aprovado: true });
            setChecklist(updatedChecklist);
            //update checklist row on the table
            dispatch(updateSingleRow(updatedChecklist));
            dispatch(setFeedback({
                message: "Checklist aprovado!",
                type: "success",
            }));
        }
        catch (e) {
            dispatch(setFeedback({
                message: `Erro ao aprovar checklist : ${e.message}`,
                type: "error",
            }));
        }
    };
    const reproveChecklist = async () => {
        if (!checklist)
            return;
        try {
            const { id_checklist_movimentacao } = checklist;
            const updatedChecklist = await CheckListService.update(Number(id_checklist_movimentacao), { aprovado: false, realizado: false });
            setChecklist(updatedChecklist);
            dispatch(updateSingleRow(updatedChecklist));
            dispatch(setFeedback({
                message: "Checklist reprovado!",
                type: "success",
            }));
        }
        catch (e) {
            dispatch(setFeedback({
                message: `Erro ao reprovar checklist : ${e.message}`,
                type: "error",
            }));
        }
    };
    const fetchData = async () => {
        try {
            const data = await CheckListService.getById(id_checklist);
            setChecklist(data);
            setItems(data.items);
        }
        catch (error) {
            dispatch(setFeedback({
                message: "Failed to fetch checklist data",
                type: "error",
            }));
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (_jsxs(Box, { sx: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
        }, children: [permissionToFullfill && (_jsx(Typography, { children: "Preencha todos os items do checklist e pressione \"Concluir\"" })), _jsx(Grid, { container: true, spacing: 2, columns: { xs: 1, sm: 2, md: 3, lg: 4 }, children: items.map((item, index) => (_jsx(Grid, { item: true, xs: 1, sm: 1, md: 1, lg: 1, children: _jsx(ChecklistItemCard, { updateSingleItem: updateSingleItem, checklist: checklist, checklistItem: item }) }, index))) }), permissionToAprove && (_jsxs(Stack, { direction: "row", gap: 2, children: [_jsx(Button, { onClick: aproveChecklist, variant: "contained", children: "Aprovar" }), _jsx(Button, { onClick: reproveChecklist, variant: "contained", color: "error", children: "Reprovar" })] })), permissionToFullfill && (_jsx(Button, { variant: "contained", onClick: concludeChecklist, children: "Concluir" }))] }));
};
export default ChecklistView;
