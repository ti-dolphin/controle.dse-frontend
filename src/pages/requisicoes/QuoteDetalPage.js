import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect } from "react";
import { Box, Button, Dialog, DialogTitle, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import QuoteService from "../../services/requisicoes/QuoteService";
import QuoteForm from "../../components/requisicoes/QuoteForm";
import { useDispatch, useSelector } from "react-redux";
import { setAccesType, setQuote } from "../../redux/slices/requisicoes/quoteSlice";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import QuoteItemsTable from "../../components/requisicoes/QuoteItemsTable";
import QuoteAttachmentList from "../../components/requisicoes/QuoteAttachmentList";
import { setRequisition } from "../../redux/slices/requisicoes/requisitionSlice";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { UserService } from "../../services/UserService";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import UpperNavigation from "../../components/shared/UpperNavigation";
const QuoteDetailPage = () => {
    const dispatch = useDispatch();
    const { id_cotacao } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const domain = window.location.origin;
    const accesType = useSelector((state) => state.quote.accessType);
    const requisition = useSelector((state) => state.requisition.requisition);
    const [fullScreenItems, setFullScreenItems] = React.useState(false);
    const handleSubmitQuote = async (e, data) => {
        e.preventDefault();
        try {
            const updatedQuote = await QuoteService.update(data.id_cotacao, {
                descricao: data.descricao,
                observacao: data.observacao,
                id_classificacao_fiscal: data.id_classificacao_fiscal,
                id_condicao_pagamento: data.id_condicao_pagamento,
                id_tipo_frete: data.id_tipo_frete,
                fornecedor: data.fornecedor,
                valor_frete: data.valor_frete,
                valor_total: data.valor_total,
                cnpj_faturamento: data.cnpj_faturamento,
                cnpj_fornecedor: data.cnpj_fornecedor,
            });
            dispatch(setQuote(updatedQuote));
            dispatch(setFeedback({ message: `Cotação atualizada com sucesso!`, type: 'success' }));
        }
        catch (e) {
            dispatch(setFeedback({ message: `Erro ao atualizar cotação : ${e.message}`, type: 'error' }));
        }
    };
    const handleBack = () => {
        navigate(-1);
    };
    const hanldeCreateSupplierAccess = async () => {
        try {
            const supplierUrl = await UserService.getSupplierAcces(Number(id_cotacao), Number(requisition.ID_REQUISICAO));
            navigator.clipboard.writeText(`${domain}/${supplierUrl}`);
            dispatch(setFeedback({ message: `Acesso ao fornecedor copiado para a rea de transferência!`, type: 'success' }));
            return;
        }
        catch (e) {
            dispatch(setFeedback({
                message: `Erro ao criar acesso ao fornecedor : ${e.message}`,
                type: 'error'
            }));
        }
    };
    const fetchData = useCallback(async () => {
        try {
            if (token) {
                window.localStorage.setItem("token", token);
                dispatch(setAccesType("supplier"));
            }
            const data = await QuoteService.getById(Number(id_cotacao));
            const reqData = await RequisitionService.getById(Number(data.id_requisicao));
            dispatch(setQuote(data));
            dispatch(setRequisition(reqData));
        }
        catch (e) {
            dispatch(setFeedback({
                message: `Erro ao carregar dados da cota o: ${e.message}`,
                type: "error",
            }));
        }
    }, [id_cotacao, token, dispatch]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return (_jsxs(Box, { sx: {
            flexGrow: 1,
            p: 2,
            width: "100%",
            height: "100vh",
            margin: "0 auto",
            backgroundColor: "background",
        }, children: [accesType !== "supplier" && _jsx(UpperNavigation, { handleBack: handleBack }), _jsxs(Grid, { container: true, spacing: 2, sx: { justifyContent: "center" }, children: [_jsx(Grid, { item: true, xs: 12, md: 8, sx: { padding: 2 }, children: _jsxs(Paper, { sx: {
                                p: 2,
                                elevation: 1,
                                borderRadius: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }, children: [_jsx(QuoteForm, { onSubmit: handleSubmitQuote }), accesType !== "supplier" && (_jsx(Button, { onClick: hanldeCreateSupplierAccess, children: "Link de fornecedor" }))] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 2, elevation: 1, borderRadius: 2 }, children: [_jsx(Typography, { color: "primary.main", variant: "h6", children: "Anexos" }), _jsx(QuoteAttachmentList, { id_cotacao: Number(id_cotacao) })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Paper, { sx: { p: 2, mb: 2, elevation: 1, borderRadius: 2 }, children: [_jsxs(Stack, { direction: "row", alignItems: "center", gap: 2, children: [" ", _jsx(Typography, { variant: "h6", color: "primary.main", children: "Itens da cota\u00E7\u00E3o" }), _jsx(IconButton, { onClick: () => setFullScreenItems(true), children: _jsx(FullscreenIcon, {}) })] }), _jsx(QuoteItemsTable, { hideFooter: false, tableMaxHeight: 400 })] }) })] }), _jsxs(Dialog, { open: fullScreenItems, onClose: () => setFullScreenItems(false), fullScreen: true, children: [_jsx(DialogTitle, { children: _jsxs(Stack, { direction: "row", alignItems: "center", gap: 2, children: [_jsx(Typography, { variant: "h6", color: "primary.main", children: "Itens da cota\u00E7\u00E3o" }), _jsx(Button, { variant: "contained", onClick: () => setFullScreenItems(false), color: "error", children: "Fechar" })] }) }), _jsx(QuoteItemsTable, { hideFooter: false, tableMaxHeight: 600 })] })] }));
};
export default QuoteDetailPage;
