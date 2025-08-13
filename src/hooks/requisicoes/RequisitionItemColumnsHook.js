import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { formatCurrency, getDateFromISOstring } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Checkbox, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { setItemBeingReplaced, setReplacingItemProduct, } from "../../redux/slices/requisicoes/requisitionItemSlice";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import FillAllDialog from "../../components/shared/FillAllDialog";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
import { useParams } from "react-router-dom";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
export const useRequisitionItemColumns = (addingReqItems, editItemFieldsPermitted, handleDeleteItem, handleFillOCS, handleFillShippingDate, handleChangeQuoteItemsSelected, quoteItemsSelected, selectionModel, blockFields) => {
    const dispatch = useDispatch();
    const { id_requisicao } = useParams();
    const [fillingOC, setFillingOC] = useState(false);
    const [ocValue, setOcValue] = useState(null);
    const [fillingShippingDate, setFillingShippingDate] = useState(false);
    const [shippingDate, setShippingDate] = useState("");
    const [dinamicColumns, setDinamicColumns] = useState([]);
    const { updatingRecentProductsQuantity } = useSelector((state) => state.requisitionItem);
    const concludeFillingOC = async () => {
        if (!ocValue) {
            dispatch(setFeedback({
                message: "Digite um valor para preencher a OC",
                type: "error",
            }));
            return;
        }
        await handleFillOCS(ocValue);
        setOcValue(null);
        setFillingOC(false);
    };
    const concludeFillingShippingDate = async () => {
        if (!shippingDate) {
            dispatch(setFeedback({
                message: "Data inválida",
                type: "error",
            }));
            return;
        }
        await handleFillShippingDate(shippingDate);
        setShippingDate("");
        setFillingShippingDate(false);
    };
    const handleChangeshippingDate = (e) => {
        setShippingDate(e.target.value);
    };
    const openOCDialog = () => {
        if (!selectionModel.length) {
            dispatch(setFeedback({
                message: "Selecione os itens para preencher a OC",
                type: "error",
            }));
            return;
        }
        setFillingOC(true);
    };
    const openShippingDateDialog = () => {
        if (!selectionModel.length) {
            dispatch(setFeedback({
                message: "Selecione os itens para preencher a data de entrega",
                type: "error",
            }));
            return;
        }
        setFillingShippingDate(true);
    };
    const columns = [
        {
            field: "id_item_requisicao",
            headerName: "ID",
            type: "number",
            flex: 0.2,
        },
        {
            field: "produto_codigo",
            headerName: "Código Produto",
            type: "string",
            flex: 0.5,
        },
        {
            field: "produto_descricao",
            headerName: "Descrição",
            type: "string",
            flex: 1,
            renderCell: (params) => (_jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", children: params.value }) })),
        },
        {
            field: "quantidade",
            headerName: "Quantidade",
            type: "number",
            editable: true,
            flex: 0.5,
            renderCell: (params) => (_jsx(Box, { sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    height: "100%",
                }, children: _jsx(Typography, { fontSize: "small", fontWeight: "bold", children: params.value }) })),
        },
        {
            field: "data_entrega",
            headerName: "Data de entrega",
            width: 150,
            type: "date",
            editable: true,
            flex: 0.75,
            valueGetter: (data_entrega) => data_entrega ? getDateFromISOstring(data_entrega) : null,
            renderHeader: () => (_jsxs(Box, { sx: {
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                }, children: [_jsx(Typography, { fontSize: "0.9rem", fontWeight: "bold", color: "primary", children: "Data entrega" }), editItemFieldsPermitted && (_jsx(Tooltip, { title: "Preencher", children: _jsx(IconButton, { onClick: openShippingDateDialog, sx: { height: 24, width: 24 }, children: _jsx(ArticleOutlinedIcon, {}) }) })), editItemFieldsPermitted && (_jsx(FillAllDialog, { open: fillingShippingDate, onClose: () => setFillingShippingDate(false), onChange: handleChangeshippingDate, onConfirm: concludeFillingShippingDate, value: shippingDate, label: "Data de entrega", type: "date", title: "Digite a data desejada para preencher todos os itens" }))] })),
        },
        {
            field: "produto_unidade",
            headerName: "Unidade",
            flex: 0.4,
            type: "string",
        },
        {
            field: "oc",
            headerName: "OC",
            editable: true,
            type: "string",
            valueGetter: (oc) => oc || "",
            flex: 0.45,
            renderHeader: () => (_jsxs(Box, { sx: {
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                }, children: [_jsx(Typography, { fontSize: "0.9rem", fontWeight: "bold", color: "primary", children: "OC" }), editItemFieldsPermitted && (_jsx(Tooltip, { title: "Preencher", children: _jsx(IconButton, { onClick: openOCDialog, sx: { height: 24, width: 24 }, children: _jsx(ArticleOutlinedIcon, {}) }) })), editItemFieldsPermitted && (_jsx(FillAllDialog, { open: fillingOC, onClose: () => setFillingOC(false), onConfirm: concludeFillingOC, value: ocValue, onChange: (e) => setOcValue(Number(e.target.value)), label: "N\u00FAmero da OC", type: "number", title: "Digite o valor desejado para preencher todos os itens" }))] })),
        },
        {
            field: "observacao",
            headerName: "Observação",
            type: "string",
            editable: true,
            valueGetter: (observacao) => observacao || "N/A",
            renderCell: (params) => (_jsxs(Box, { sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                }, children: [_jsx(Typography, { fontSize: "small", fontWeight: "bold", children: params.value }), _jsx(Tooltip, { title: "Copiar observa\u00E7\u00E3o", children: _jsx(IconButton, { onClick: () => navigator.clipboard.writeText(params.value), sx: { padding: 0 }, children: _jsx(ContentCopyIcon, { fontSize: "small" }) }) })] })),
            flex: 0.6,
        },
        {
            field: "actions",
            headerName: "Ações",
            type: "actions",
            flex: 0.5,
            renderCell: (row) => {
                const { id } = row;
                return (_jsxs(Box, { sx: { display: "flex", justifyContent: "center", gap: 1 }, children: [editItemFieldsPermitted && (_jsx(Tooltip, { title: "Excluir item", children: _jsx(IconButton, { disabled: blockFields, onClick: () => handleDeleteItem(Number(id)), color: "error", children: _jsx(DeleteIcon, {}) }) })), editItemFieldsPermitted && (_jsx(Tooltip, { title: "Substituir produto", children: _jsx(IconButton, { onClick: () => {
                                    dispatch(setReplacingItemProduct(true));
                                    dispatch(setItemBeingReplaced(Number(id)));
                                }, sx: { color: "primary.main" }, children: _jsx(EditIcon, {}) }) }))] }));
            },
        },
    ];
    // Definindo filteredColumns para sempre executar hooks depois
    let filteredColumns = columns;
    if (updatingRecentProductsQuantity) {
        const selectedColumns = ["produto_descricao", "quantidade"];
        filteredColumns = columns.filter((col) => selectedColumns.includes(col.field));
    }
    else if (addingReqItems) {
        filteredColumns = columns.filter((col) => ["produto_descricao"].includes(col.field));
    }
    const fetchDinamicColumns = useCallback(async () => {
        try {
            const rawCols = await RequisitionItemService.getDinamicColumns(Number(id_requisicao));
            const colsWithRenderCell = rawCols.map((col) => ({
                ...col,
                renderCell: (params) => {
                    const { id_item_requisicao } = params.row;
                    const quoteItem = params.row.items_cotacao.find((item) => Number(item.id_cotacao) === Number(params.field));
                    const hasquoteItem = quoteItem && !quoteItem.indisponivel;
                    const parciallyQuoted = hasquoteItem ? Number(quoteItem.quantidade_cotada) < Number(quoteItem.quantidade_solicitada) : false;
                    return (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [hasquoteItem && formatCurrency(Number(quoteItem?.subtotal) || 0), hasquoteItem && (_jsx(Checkbox, { disabled: blockFields || !editItemFieldsPermitted, onChange: (e) => handleChangeQuoteItemsSelected(e, Number(quoteItem?.id_item_cotacao), Number(id_item_requisicao)), checked: quoteItemsSelected.get(Number(id_item_requisicao)) ===
                                    Number(quoteItem?.id_item_cotacao)
                                    ? true
                                    : false, icon: _jsx(RadioButtonUncheckedIcon, {}), checkedIcon: _jsx(CheckCircleIcon, {}), sx: { color: "primary.main" } })), quoteItem?.indisponivel > 0 && (_jsx(Tooltip, { title: `Indisponível no fornecedor: ${col.headerName}`, children: _jsx(ErrorIcon, { color: "error" }) })), parciallyQuoted && (_jsx(Tooltip, { title: `Quantidade cotada: ${quoteItem?.quantidade_cotada}`, children: _jsx(ErrorIcon, { color: "secondary" }) }))] }));
                },
            }));
            setDinamicColumns(colsWithRenderCell);
        }
        catch (e) {
            dispatch(setFeedback({
                message: "Erro ao buscar colunas dinâmicas",
                type: "error",
            }));
        }
    }, [
        dispatch,
        handleChangeQuoteItemsSelected,
        id_requisicao,
        quoteItemsSelected,
    ]);
    const isDinamicField = useCallback((field) => {
        // Descomente abaixo para ativar a checagem real de colunas dinâmicas
        return dinamicColumns.some((col) => col.field === field);
    }, [dinamicColumns]);
    useEffect(() => {
        if (addingReqItems)
            return;
        if (updatingRecentProductsQuantity)
            return;
        fetchDinamicColumns();
    }, [fetchDinamicColumns, addingReqItems, updatingRecentProductsQuantity]);
    return {
        columns: dinamicColumns.length > 0
            ? [...filteredColumns, ...dinamicColumns]
            : filteredColumns,
        fillingOC,
        ocValue,
        fillingShippingDate,
        shippingDate,
        dinamicColumns,
        isDinamicField,
    };
};
