import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Grid, Paper, Typography, Divider, Stack, Button, DialogTitle, Dialog, DialogActions, DialogContent, IconButton, } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { clearRequisition, setRequisition } from "../../redux/slices/requisicoes/requisitionSlice";
import RequisitionStatusStepper from "../../components/requisicoes/RequisitionStatusStepper";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import RequisitionDetailsTable from "../../components/requisicoes/RequisitionDetailsTable";
import AddIcon from "@mui/icons-material/Add";
import RequisitionAttachmentList from "../../components/requisicoes/RequisitionAttachmentList";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import RequisitionTimeline from "../../components/requisicoes/RequisitionTimeline";
import RequisitionItemsTable from "../../components/requisicoes/RequisitionItemsTable";
import { clearNewItems, clearRecentProducts, setAddingProducts, setItemBeingReplaced, setNewItems, setProductSelected, setRefresh, setReplacingItemProduct, setUpdatingRecentProductsQuantity } from "../../redux/slices/requisicoes/requisitionItemSlice";
import ProductsTable from "../../components/requisicoes/ProductsTable";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
import QuoteList from "../../components/requisicoes/QuoteList";
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency } from "../../utils";
import UpperNavigation from "../../components/shared/UpperNavigation";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import RequisitionCommentList from "../../components/requisicoes/RequisitionCommentList";
const RequisitionDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const { addingProducts, updatingRecentProductsQuantity } = useSelector((state) => state.requisitionItem);
    const { id_requisicao } = useParams();
    const { recentProductsAdded, replacingItemProduct, itemBeingReplaced, productSelected, refresh } = useSelector((state) => state.requisitionItem);
    const { requisition, refreshRequisition } = useSelector((state) => state.requisition);
    const [quoteListOpen, setQuoteListOpen] = useState(false);
    const [fullScreenItems, setFullScreenItems] = useState(false);
    const fullScreenItemsTableContainer = useRef(null);
    const fetchData = useCallback(async () => {
        const requisition = await RequisitionService.getById(Number(id_requisicao));
        dispatch(setRequisition(requisition));
    }, [id_requisicao, dispatch]);
    // const handleChangeObservation = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //   const {value} = e.target;
    //   setObservation(value);
    // };
    // const startObservationEditMode= (e:  React.FocusEvent<HTMLTextAreaElement>) => { 
    //   const admin = Number(user?.PERM_ADMINISTRADOR) === 1;
    //   const allowedToEdit = Number(user?.CODPESSOA) === Number(requisition.criado_por);
    //   const editObservationPermittedForUser = admin || allowedToEdit;
    //   if (!editObservationPermittedForUser) {
    //     dispatch(
    //       setFeedback({
    //         message: "Você não tem permissão para editar esta observação.",
    //         type: "error",
    //       })
    //     );
    //     e.target.blur();
    //     return;
    //   }
    //   setEditingObservation(true);
    // }
    // const handleSaveObservation = async ( ) =>  { 
    //   try{ 
    //     const updatedRequisition = await RequisitionService.update((Number(requisition.ID_REQUISICAO)), { 
    //       OBSERVACAO: observation
    //     });
    //     dispatch(setRequisition(updatedRequisition));
    //     setEditingObservation(false);
    //     dispatch(setFeedback({ 
    //       message: 'Observação salva com sucesso',
    //       type: 'success'
    //     }));
    //     return;
    //   }catch(e){ 
    //     dispatch(setFeedback({ 
    //       message: 'Erro ao salvar observação',
    //       type: 'error'
    //     }))
    //   }
    // };
    const createItemsFromProducts = async () => {
        try {
            const newItemIds = await RequisitionItemService.createMany(recentProductsAdded, requisition.ID_REQUISICAO);
            dispatch(setFeedback({
                message: 'Produtos adicionados com sucesso! Insira as quantidades desejadas',
                type: 'success'
            }));
            dispatch(setNewItems(newItemIds));
            return;
        }
        catch (e) {
            dispatch(setFeedback({
                message: 'Erro ao criar itens da requisição',
                type: 'error'
            }));
        }
    };
    const concludeReplaceItemProduct = async () => {
        if (!itemBeingReplaced || !productSelected)
            return;
        try {
            await RequisitionItemService.update(itemBeingReplaced, { id_produto: productSelected });
            dispatch(setFeedback({
                message: 'Produto substituído com sucesso',
                type: 'success'
            }));
            dispatch(setRefresh(!refresh));
            dispatch(setReplacingItemProduct(false));
            dispatch(setItemBeingReplaced(null));
            dispatch(setProductSelected(null));
        }
        catch (e) {
            dispatch(setFeedback({
                message: 'Erro ao substituir produto',
                type: 'error'
            }));
        }
    };
    const concludeAddProducts = async () => {
        await createItemsFromProducts();
        dispatch(setUpdatingRecentProductsQuantity(true));
        dispatch(setAddingProducts(false));
        dispatch(clearRecentProducts());
    };
    const concludeUpdateItemsQuantity = () => {
        setTimeout(() => {
            dispatch(setUpdatingRecentProductsQuantity(false));
            dispatch(clearNewItems());
        }, 1000);
    };
    const handleClose = () => {
        dispatch(setAddingProducts(false));
        dispatch(setReplacingItemProduct(false));
    };
    const handleBack = () => {
        navigate("/requisicoes");
        dispatch(clearRequisition());
    };
    const shouldShowAddItemsButton = () => {
        return (user?.PERM_COMPRADOR ||
            (Number(requisition.criado_por?.CODPESSOA) === Number(user?.CODPESSOA) &&
                requisition.status?.nome === "Em edição"));
    };
    useEffect(() => {
        if (id_requisicao) {
            fetchData();
        }
    }, [id_requisicao, fetchData, refreshRequisition]);
    return (_jsxs(Box, { height: "100vh", width: "98vw", p: {
            xs: 1,
            md: 0.5,
        }, sx: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto",
        }, bgcolor: "background", children: [_jsx(UpperNavigation, { handleBack: handleBack, children: _jsxs(Typography, { sx: { fontSize: "1rem" }, fontWeight: 600, color: "primary.main", children: [requisition.ID_REQUISICAO, " | ", requisition.DESCRIPTION, " |", " ", requisition.projeto?.DESCRICAO] }) }), _jsxs(Grid, { container: true, spacing: 0.6, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(Paper, { children: _jsx(Box, { sx: { p: 1 }, children: id_requisicao && (_jsx(RequisitionStatusStepper, { id_requisicao: Number(id_requisicao) })) }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Paper, { sx: { p: 1 }, children: [_jsx(Typography, { variant: "subtitle1", color: "primary.main", fontWeight: 500, mb: 0.5, children: "Detalhes da requisi\u00E7\u00E3o" }), _jsx(Divider, { sx: { mb: 1 } }), _jsx(RequisitionDetailsTable, { requisition: requisition })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Grid, { container: true, spacing: 1, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: {
                                            p: 1,
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                        }, children: [_jsx(Typography, { variant: "subtitle1", color: "primary.main", fontWeight: 500, mb: 0.5, children: "Coment\u00E1rios" }), _jsx(Divider, { sx: { mb: 1 } }), _jsx(Box, { sx: {
                                                    flex: 1,
                                                    maxHeight: 140,
                                                    overflowY: "auto",
                                                }, children: _jsx(RequisitionCommentList, {}) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: {
                                            p: 1,
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }, children: [_jsx(Typography, { variant: "subtitle1", color: "primary.main", fontWeight: 500, mb: 0.5, children: "Anexos e Links" }), _jsx(Divider, {}), _jsx(Box, { sx: { flex: 1, overflowY: "auto" }, children: _jsx(RequisitionAttachmentList, { id_requisicao: Number(id_requisicao) }) })] }) }), _jsx(Grid, { item: true, xs: 12 })] }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Paper, { sx: { p: 1 }, children: [_jsx(Typography, { variant: "subtitle1", color: "primary.main", fontWeight: 500, mb: 0, children: "Timeline / Hist\u00F3rico" }), _jsx(Divider, {}), _jsx(Box, { children: _jsx(RequisitionTimeline, {}) })] }) }), _jsx(Grid, { item: true, xs: 12, sx: {
                            minHeight: {
                                xs: 800,
                                md: 400,
                            },
                        }, children: _jsxs(Paper, { sx: { p: 1 }, children: [_jsxs(Stack, { direction: "row", gap: 2, children: [_jsx(IconButton, { onClick: () => setFullScreenItems(true), children: _jsx(FullscreenIcon, {}) }), _jsxs(Stack, { direction: { xs: "column", sm: "row" }, spacing: 1, alignItems: "center", children: [shouldShowAddItemsButton() && (_jsxs(Button, { onClick: () => dispatch(setAddingProducts(true)), variant: "contained", size: "small", children: [_jsx(AddIcon, { fontSize: "small" }), "Adicionar Itens"] })), _jsx(Button, { onClick: () => setQuoteListOpen(true), variant: "contained", size: "small", children: "Cota\u00E7\u00F5es" }), _jsx(Box, { ml: "auto", children: _jsxs(Typography, { variant: "subtitle2", color: "success.main", children: ["Custo total:", " ", formatCurrency(Number(requisition.custo_total || 0))] }) })] })] }), _jsx(Divider, { sx: { mb: 1 } }), _jsx(Box, { children: _jsx(RequisitionItemsTable, { hideFooter: false, tableMaxHeight: 400 }) })] }) })] }), _jsxs(Dialog, { open: addingProducts || replacingItemProduct, onClose: handleClose, maxWidth: "lg", fullWidth: true, "aria-labelledby": "add-products-dialog-title", children: [_jsx(IconButton, { onClick: handleClose, color: "error", sx: { position: "absolute", top: 0, right: 0 }, children: _jsx(CloseIcon, {}) }), _jsx(DialogTitle, { id: "add-products-dialog-title", children: _jsxs(Typography, { variant: "h6", fontWeight: 600, color: "primary.main", children: [" ", "Adicionar Itens"] }) }), _jsx(DialogContent, { children: (addingProducts || replacingItemProduct) && _jsx(ProductsTable, {}) }), _jsxs(DialogActions, { children: [addingProducts && recentProductsAdded.length > 0 && (_jsx(Button, { onClick: concludeAddProducts, variant: "contained", color: "primary", sx: { textTransform: "none", minWidth: 120 }, children: "Concluir" })), replacingItemProduct && productSelected && (_jsx(Button, { onClick: concludeReplaceItemProduct, variant: "contained", color: "primary", sx: { textTransform: "none", minWidth: 120 }, children: "Substituir item" }))] })] }), _jsxs(Dialog, { open: updatingRecentProductsQuantity, onClose: handleClose, maxWidth: "lg", fullWidth: true, "aria-labelledby": "add-products-dialog-title", children: [_jsx(DialogTitle, { id: "add-products-dialog-title", children: "Insira as quantidades dos produtos adicionados" }), _jsx(DialogContent, { children: updatingRecentProductsQuantity && (_jsx(RequisitionItemsTable, { hideFooter: false })) }), _jsx(DialogActions, { children: _jsx(Button, { onClick: concludeUpdateItemsQuantity, variant: "contained", color: "primary", sx: { textTransform: "none", minWidth: 120 }, children: "Concluir" }) })] }), _jsxs(Dialog, { maxWidth: "md", fullWidth: true, open: quoteListOpen, children: [_jsx(DialogTitle, { color: "primary.main", children: "Cota\u00E7\u00F5es desta requisi\u00E7\u00E3o" }), _jsxs(DialogContent, { sx: {
                            backgroundColor: "background.default",
                        }, children: [_jsx(QuoteList, {}), _jsx(IconButton, { onClick: () => setQuoteListOpen(false), color: "error", sx: { position: "absolute", top: 0, right: 0 }, children: _jsx(CloseIcon, {}) })] })] }), _jsxs(Dialog, { fullScreen: true, open: fullScreenItems, onClose: () => setFullScreenItems(false), sx: { display: "flex", flexDirection: "column" }, children: [_jsx(DialogTitle, { sx: { maxHeight: 60 }, children: _jsxs(Stack, { direction: "row", alignItems: "center", gap: 2, children: [_jsx(Typography, { fontSize: "normal", color: "primary.main", gutterBottom: true, children: "Itens" }), _jsx(Button, { variant: "contained", color: "error", sx: { fontSize: "small" }, onClick: () => setFullScreenItems(false), children: "Fechar" }), _jsxs(Stack, { direction: { xs: "column", sm: "row" }, spacing: 1, alignItems: "center", children: [shouldShowAddItemsButton() && (_jsxs(Button, { onClick: () => dispatch(setAddingProducts(true)), variant: "contained", size: "small", children: [_jsx(AddIcon, { fontSize: "small" }), "Adicionar Itens"] })), _jsx(Button, { onClick: () => setQuoteListOpen(true), variant: "contained", size: "small", children: "Cota\u00E7\u00F5es" }), _jsx(Box, { ml: "auto", children: _jsxs(Typography, { variant: "subtitle2", color: "success.main", children: ["Custo total:", " ", formatCurrency(Number(requisition.custo_total || 0))] }) })] })] }) }), _jsx(DialogContent, { ref: fullScreenItemsTableContainer, sx: { background: "background.default" }, children: _jsx(RequisitionItemsTable, { hideFooter: false, tableMaxHeight: (fullScreenItemsTableContainer.current?.offsetHeight || 0) - 60 }) })] })] }));
};
export default RequisitionDetailPage;
