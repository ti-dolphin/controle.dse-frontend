import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GridCellModes, useGridApiRef, } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { useRequisitionItemColumns } from "../../hooks/requisicoes/RequisitionItemColumnsHook";
import { Box, Button, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
import BaseDataTable from "../shared/BaseDataTable";
import BaseTableToolBar from "../shared/BaseTableToolBar";
import { debounce } from "lodash";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useRequisitionItemPermissions } from "../../hooks/requisicoes/RequisitionItemPermissionsHook";
import { setProductsAdded, setRefresh, } from "../../redux/slices/requisicoes/requisitionItemSlice";
import QuoteService from "../../services/requisicoes/QuoteService";
import { useNavigate, useParams } from "react-router-dom";
import { QuoteItemService } from "../../services/requisicoes/QuoteItemService";
import { setAddingReqItems, setQuoteItems, } from "../../redux/slices/requisicoes/quoteItemSlice";
import { setRefreshRequisition, setRequisition, } from "../../redux/slices/requisicoes/requisitionSlice";
import { formatDateStringtoISOstring } from "../../utils";
const RequisitionItemsTable = ({ tableMaxHeight, hideFooter }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { id_requisicao } = useParams();
    const { requisition, refreshRequisition } = useSelector((state) => state.requisition);
    const gridApiRef = useGridApiRef();
    const quote = useSelector((state) => state.quote.quote);
    const quoteItems = useSelector((state) => state.quoteItem.quoteItems);
    const addingReqItems = useSelector((state) => state.quoteItem.addingReqItems);
    const user = useSelector((state) => state.user.user);
    const { editItemFieldsPermitted, createQuotePermitted, } = useRequisitionItemPermissions(user, requisition);
    const { newItems, updatingRecentProductsQuantity, refresh } = useSelector((state) => state.requisitionItem);
    const handleDeleteItem = async (id_item_requisicao) => {
        setBlockFields(true);
        try {
            //atualiza UI imediatamente
            const updatedItems = items.filter((item) => item.id_item_requisicao !== id_item_requisicao);
            setItems(updatedItems);
            await RequisitionItemService.delete(id_item_requisicao);
            dispatch(setRefreshRequisition(!refreshRequisition));
            dispatch(setProductsAdded(updatedItems.map((item) => item.id_produto)));
            setBlockFields(false);
            return;
        }
        catch (e) {
            dispatch(setRefreshRequisition(!refreshRequisition));
            dispatch(setFeedback({ message: "Erro ao excluir itens", type: "error" }));
            setBlockFields(false);
        }
    };
    const handleFillOCS = async (ocValue) => {
        try {
            const itemsWithOC = await RequisitionItemService.updateOCS(selectionModel, ocValue);
            if (itemsWithOC) {
                setSelectionModel([]);
                dispatch(setRefresh(!refresh));
            }
        }
        catch (e) {
            dispatch(setFeedback({ message: "Erro ao preencher OC", type: "error" }));
        }
    };
    //PREENCHER DATA DE ENTREGA DOS ITENS SELECIONADOS
    const handleFillShippingDate = async (date) => {
        if (!date) {
            dispatch(setFeedback({
                message: "Data inválida ou no formato errado",
                type: "error",
            }));
            return;
        }
        if (date) {
            const isoDate = formatDateStringtoISOstring(date);
            try {
                const itemsWithShippingDate = await RequisitionItemService.updateShippingDate(selectionModel, isoDate);
                if (itemsWithShippingDate) {
                    setSelectionModel([]);
                    dispatch(setRefresh(!refresh));
                }
            }
            catch (e) {
                dispatch(setFeedback({
                    message: "Erro ao preencher data de entrega",
                    type: "error",
                }));
            }
        }
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState([]);
    const [cellModesModel, setCellModesModel] = React.useState({});
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [quoteItemsSelected, setQuoteItemsSelected] = useState(new Map());
    const [loading, setLoading] = useState(false);
    const [blockFields, setBlockFields] = useState(false);
    //map de <id_item_requisicao, id_item_cotacao>
    //SELECIONA ITEMS DA COTAÇÃO
    const handleChangeQuoteItemsSelected = useCallback(async (e, id_item_cotacao, id_item_requisicao) => {
        if (e.target.checked) {
            setQuoteItemsSelected(new Map(quoteItemsSelected.set(id_item_requisicao, id_item_cotacao)));
            const { updatedItems, updatedRequisition } = await RequisitionItemService.updateQuoteItemsSelected(Number(id_requisicao), Object.fromEntries(quoteItemsSelected));
            setItems(updatedItems);
            dispatch(setRequisition(updatedRequisition));
            return;
        }
        quoteItemsSelected.delete(id_item_requisicao);
        setQuoteItemsSelected(new Map(quoteItemsSelected));
        const { updatedItems, updatedRequisition } = await RequisitionItemService.updateQuoteItemsSelected(Number(id_requisicao), Object.fromEntries(quoteItemsSelected));
        setItems(updatedItems);
        dispatch(setRequisition(updatedRequisition));
    }, [quoteItemsSelected, requisition, setItems]);
    const toolbarRef = React.useRef(null);
    //CRIA E RENDERIZA AS COLUNAS DA TABELA COM FUNCOES
    const { columns, isDinamicField } = useRequisitionItemColumns(addingReqItems, editItemFieldsPermitted, handleDeleteItem, handleFillOCS, handleFillShippingDate, handleChangeQuoteItemsSelected, quoteItemsSelected, selectionModel, blockFields);
    //CLIQUE NA CÈLULA
    const handleCellClick = (params, event) => {
        if (isDinamicField && isDinamicField(params.field)) {
            return;
        }
        if (params.field === "__check__")
            return;
        if (params.field === "actions")
            return;
        if (!params.isEditable) {
            dispatch(setFeedback({
                message: `O campo selecionado não é editável`,
                type: "error",
            }));
            return;
        }
        if (!editItemFieldsPermitted) {
            dispatch(setFeedback({
                message: `Você não tem permissão para editar este campo`,
                type: "error",
            }));
            return;
        }
        if (event.target.nodeType === 1 &&
            !event.currentTarget.contains(event.target)) {
            return;
        }
        setCellModesModel((prevModel) => {
            return {
                // Revert the mode of the other cells from other rows
                ...Object.keys(prevModel).reduce((acc, id) => ({
                    ...acc,
                    [id]: Object.keys(prevModel[id]).reduce((acc2, field) => ({
                        ...acc2,
                        [field]: { mode: GridCellModes.View },
                    }), {}),
                }), {}),
                [params.id]: {
                    // Revert the mode of other cells in the same row
                    ...Object.keys(prevModel[params.id] || {}).reduce((acc, field) => ({
                        ...acc,
                        [field]: { mode: GridCellModes.View },
                    }), {}),
                    [params.field]: { mode: GridCellModes.Edit },
                },
            };
        });
    };
    //PROCESSA MUDANÇA DE ESTADO DA CÉLULA "EDIT", "VIEW"
    const handleCellModesModelChange = React.useCallback((newModel) => {
        setCellModesModel(newModel);
    }, []);
    //ATUALIZA LINHA NO BACKEND
    const processRowUpdate = React.useCallback(async (newRow, oldRow) => {
        const payload = {
            id_item_requisicao: newRow.id_item_requisicao,
            quantidade: newRow.quantidade,
            data_entrega: newRow.data_entrega,
            oc: newRow.oc,
            observacao: newRow.observacao,
        };
        try {
            const updatedItem = await RequisitionItemService.update(newRow.id_item_requisicao, payload);
            return updatedItem;
        }
        catch (e) {
            dispatch(setFeedback({
                message: `Erro ao atualizar item da requisição: ${e.message}`,
                type: "error",
            }));
            return oldRow;
        }
    }, [items, dispatch]);
    //CRIA A COTAÇÃO A PARTIR DOS ITENS SELECIONADOS
    const createQuoteFromSelectedItems = async () => {
        //create quote from items and then redirect to quote page
        const quote = await QuoteService.create({
            id_requisicao: requisition.ID_REQUISICAO,
            fornecedor: "",
            observacao: "",
            descricao: "",
            valor_frete: 0,
            itemIds: selectionModel,
        });
        if (quote) {
            navigate(`cotacao/${quote.id_cotacao}`);
        }
    };
    //ADICIONA ITEMS À REQUSIIÇÃO A PARTIR DOS PRODUTOS SELECIONADOS
    const handleAddItemsToRequisition = async () => {
        if (quote) {
            try {
                const newQuoteItems = selectionModel.map((id_item_requisicao) => ({
                    id_cotacao: quote.id_cotacao,
                    id_item_requisicao,
                    quantidade_solicitada: items.find((item) => item.id_item_requisicao === id_item_requisicao)
                        ?.quantidade || 0,
                    quantidade_cotada: items.find((item) => item.id_item_requisicao === id_item_requisicao)
                        ?.quantidade || 0,
                    descricao_item: "",
                    preco_unitario: 0,
                }));
                const incrementedQuoteItems = await QuoteItemService.create(newQuoteItems);
                dispatch(setQuoteItems(incrementedQuoteItems));
                dispatch(setAddingReqItems(false));
                dispatch(setFeedback({
                    message: "Itens adicionados com sucesso à cotação",
                    type: "success",
                }));
            }
            catch (e) {
                dispatch(setFeedback({ message: "Erro ao adicionar itens", type: "error" }));
            }
        }
    };
    //SELECIONA ou DESELECIONA UMA LINHA
    const handleChangeSelection = async (newRowSelectionModel) => {
        if (!(editItemFieldsPermitted || addingReqItems)) {
            dispatch(setFeedback({
                message: "Vocé não tem permissão para editar itens",
                type: "error",
            }));
            return;
        }
        if (addingReqItems) {
            const itemsInQuoteItems = quoteItems.map((item) => item.id_item_requisicao);
            if (itemsInQuoteItems.includes(Number(newRowSelectionModel[0]))) {
                dispatch(setFeedback({
                    message: "Vocé nao pode selecionar itens que ja estao na cotação",
                    type: "error",
                }));
                return;
            }
        }
        setSelectionModel(newRowSelectionModel);
    };
    //MUDA O TERMO DE BUSCA
    const changeSearchTerm = (e) => {
        const value = e.target.value;
        setSearchTerm(value.toLowerCase());
    };
    //DEBOUNCED
    const debouncedHandleChangeSearchTerm = debounce(changeSearchTerm, 500);
    //BUSCA ITENS DA REQUISIÇÃO
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = newItems.length > 0
                ? {
                    id_requisicao: requisition.ID_REQUISICAO,
                    id_item_requisicao: { in: [...newItems] },
                    searchTerm,
                }
                : {
                    id_requisicao: requisition.ID_REQUISICAO,
                    searchTerm,
                };
            const data = await RequisitionItemService.getMany(params);
            setItems(data);
            defineSelectedQuoteItemsMap(data);
            dispatch(setProductsAdded(data.map((item) => item.id_produto)));
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            dispatch(setFeedback({
                message: "Erro ao buscar itens da requisição",
                type: "error",
            }));
        }
    }, [dispatch, requisition.ID_REQUISICAO, searchTerm, newItems]);
    //CONFIGURA O MAPA DE ITENS DE COTAÇÃO  SELECIONADOS POR ITENS DE REQUISIÇÃO
    const defineSelectedQuoteItemsMap = (items) => {
        // const map = new Map<number, number>();
        items.forEach((item) => {
            if (item.id_item_cotacao) {
                quoteItemsSelected.set(item.id_item_requisicao, item.id_item_cotacao);
            }
        });
    };
    useEffect(() => {
        if (requisition) {
            fetchData();
        }
    }, [
        dispatch,
        requisition.ID_REQUISICAO,
        fetchData,
        updatingRecentProductsQuantity,
        refresh,
    ]);
    return (_jsxs(Box, { children: [selectionModel.length > 0 && (_jsx(Box, { sx: { p: 1 }, children: !addingReqItems &&
                    !updatingRecentProductsQuantity &&
                    createQuotePermitted && (_jsx(Button, { variant: "contained", onClick: createQuoteFromSelectedItems, children: "Criar cota\u00E7\u00E3o" })) })), _jsx(BaseTableToolBar, { ref: toolbarRef, handleChangeSearchTerm: debouncedHandleChangeSearchTerm }), _jsx(Box, { sx: { height: tableMaxHeight ? tableMaxHeight : "auto" }, children: _jsx(BaseDataTable, { apiRef: gridApiRef, density: "compact", getRowId: (row) => row.id_item_requisicao, loading: loading, theme: theme, disableColumnMenu: true, rows: items, checkboxSelection: true, onRowSelectionModelChange: handleChangeSelection, rowSelectionModel: selectionModel, disableRowSelectionOnClick: true, columns: columns, cellModesModel: cellModesModel, onCellModesModelChange: handleCellModesModelChange, onCellClick: handleCellClick, processRowUpdate: processRowUpdate, hideFooter: hideFooter }) }), addingReqItems && (_jsx(Box, { sx: { display: "flex", justifyContent: "flex-end", p: 2 }, children: _jsx(Button, { variant: "contained", onClick: handleAddItemsToRequisition, children: "Adicionar itens" }) }))] }));
};
export default RequisitionItemsTable;
