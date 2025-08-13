import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QuoteService from '../../services/requisicoes/QuoteService';
import { Box, IconButton, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils';
import DeleteIcon from '@mui/icons-material/Delete';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import { setRefresh } from '../../redux/slices/requisicoes/requisitionItemSlice';
const QuoteList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const refresh = useSelector((state) => state.requisitionItem.refresh);
    const permissionToDeleteQuote = Number(user?.PERM_ADMINISTRADOR) === 1 || Number(user?.PERM_COMPRADOR) === 1;
    const requisition = useSelector((state) => state.requisition.requisition);
    const [quotes, setQuotes] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [quoteIdToDelete, setQuoteIdToDelete] = useState(0);
    const handleOpenDeleteDialog = (id_cotacao) => {
        if (!permissionToDeleteQuote) {
            dispatch(setFeedback({
                message: "Você não tem permissão para excluir a cotação.",
                type: "error",
            }));
            return;
        }
        setQuoteIdToDelete(id_cotacao);
        setDeleteDialogOpen(true);
    };
    const handleDeleteQuote = async (id_cotacao) => {
        try {
            await QuoteService.delete(id_cotacao);
            setQuotes(quotes.filter((quote) => quote.id_cotacao !== id_cotacao));
            dispatch(setRefresh(!refresh));
            dispatch(setFeedback({
                message: "Cotação excluida com sucesso",
                type: "success",
            }));
            setDeleteDialogOpen(false);
            setQuoteIdToDelete(0);
        }
        catch (e) {
            dispatch(setFeedback({
                message: "Erro ao excluir cotacao",
                type: "error",
            }));
        }
    };
    const fetchData = useCallback(async () => {
        if (requisition) {
            const data = await QuoteService.getMany({
                id_requisicao: requisition.ID_REQUISICAO
            });
            setQuotes(data);
        }
    }, [requisition]);
    useEffect(() => {
        fetchData();
    }, [requisition]);
    return (_jsxs(Box, { sx: { width: "100%", maxWidth: 360, p: 2, maxHeight: 500 }, children: [_jsx("nav", { "aria-label": "main mailbox folders", children: _jsx(List, { sx: { display: "flex", flexDirection: "column", gap: 1 }, children: quotes.map((quote, index) => {
                        return (_jsxs(ListItem, { sx: {
                                backgroundColor: "white",
                                borderRadius: 1,
                                elevation: 1,
                                padding: 1,
                            }, disablePadding: true, children: [_jsx(ListItemButton, { onClick: () => navigate(`cotacao/${quote.id_cotacao}`), children: _jsx(Box, { sx: { display: "flex", flexDirection: "column", gap: 1 }, children: _jsx(Stack, { direction: "column", gap: 1, children: _jsxs(Box, { children: [_jsxs(Stack, { direction: "row", gap: 1, children: [_jsx(Typography, { fontFamily: "Poppins", fontWeight: "bold", children: "n\u00BA da cota\u00E7\u00E3o:" }), _jsx(Typography, { sx: { color: "text.secondary" }, children: quote.id_cotacao })] }), _jsxs(Stack, { direction: "row", gap: 1, children: [_jsx(Typography, { fontFamily: "Poppins", fontWeight: "bold", children: "Fornecedor:" }), _jsx(Typography, { sx: { color: "text.secondary" }, children: quote.fornecedor })] }), _jsxs(Stack, { direction: "row", gap: 1, children: [_jsx(Typography, { fontFamily: "Poppins", fontWeight: "bold", children: "Valor da cota\u00E7\u00E3o:" }), _jsx(Typography, { color: "green", children: formatCurrency(Number(quote.valor_total || 0)) })] })] }) }) }) }), _jsx(IconButton, { onClick: () => handleOpenDeleteDialog(quote.id_cotacao), color: "error", children: _jsx(DeleteIcon, {}) })] }, index));
                    }) }) }), _jsx(BaseDeleteDialog, { open: deleteDialogOpen, onConfirm: () => handleDeleteQuote(quoteIdToDelete), onCancel: () => {
                    setDeleteDialogOpen(false);
                    setQuoteIdToDelete(0);
                } })] }));
};
export default QuoteList;
