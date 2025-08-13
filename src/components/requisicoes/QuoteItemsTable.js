import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GridCellModes, } from "@mui/x-data-grid";
import { useState, useCallback, useEffect, useMemo } from "react";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { QuoteItemService } from "../../services/requisicoes/QuoteItemService";
import BaseDataTable from "../shared/BaseDataTable";
import BaseTableToolBar from "../shared/BaseTableToolBar";
import { debounce } from "lodash";
import { useQuoteItemColumns } from "../../hooks/requisicoes/QuoteItemColumnsHoook";
import { useQuoteItemPermissions } from "../../hooks/requisicoes/QuoteItemPermissionsHook";
import RequisitionItemsTable from "./RequisitionItemsTable";
import CloseIcon from '@mui/icons-material/Close';
import { setAddingReqItems, setQuoteItems, setSingleQuoteItem } from "../../redux/slices/requisicoes/quoteItemSlice";
import { useParams } from "react-router-dom";
const QuoteItemsTable = ({ tableMaxHeight, hideFooter, }) => {
    const dispatch = useDispatch();
    const { token } = useParams();
    const user = useSelector((state) => state.user.user);
    const theme = useTheme();
    const { quote, accessType } = useSelector((state) => state.quote);
    const { quoteItems, addingReqItems } = useSelector((state) => state.quoteItem);
    const [searchTerm, setSearchTerm] = useState("");
    const [cellModesModel, setCellModesModel] = useState({});
    const [loading, setLoading] = useState(false);
    const [blockFields, setBlockFields] = useState(false);
    const isSupplierRoute = accessType === "supplier" ? true : false;
    const handleUpdateUnavailable = async (e, itemId) => {
        setBlockFields(true);
        const item = quoteItems.find((item) => item.id_item_cotacao === itemId);
        if (!item)
            return;
        try {
            const payload = {
                quantidade_cotada: item.quantidade_cotada,
                ICMS: Number(item.ICMS),
                IPI: Number(item.IPI),
                ST: Number(item.ST),
                observacao: item.observacao,
                preco_unitario: item.preco_unitario,
                subtotal: item.subtotal,
                id_cotacao: Number(item.id_cotacao),
                indisponivel: e.target.checked ? 1 : 0,
                id_item_requisicao: Number(item.id_item_requisicao),
            };
            const updatedItem = {
                ...item,
                ...payload,
                subtotal: e.target.checked ? 0 : item.subtotal,
            };
            if (!e.target.checked) {
                //caso o item seja desmarcado, precisa ser enviado ao backend e depois atualizado para que o novo subtotal seja calculado
                if (token) {
                    //se tiver token na url, enviar ao backend
                    const updatedItem = await QuoteItemService.update(itemId, payload, token);
                    dispatch(setSingleQuoteItem(updatedItem));
                    setBlockFields(false);
                    return;
                }
                const updatedItem = await QuoteItemService.update(itemId, payload);
                dispatch(setSingleQuoteItem(updatedItem));
                setBlockFields(false);
                return;
            }
            dispatch(setSingleQuoteItem(updatedItem));
            debouncedSave(payload, item.id_item_cotacao, item);
            return;
        }
        catch (e) {
            dispatch(setSingleQuoteItem(item));
            dispatch(setFeedback({
                message: `Erro ao atualizar o item ${item.produto_descricao} - ${e.message}`,
                type: "error",
            }));
        }
    };
    const { columns } = useQuoteItemColumns(handleUpdateUnavailable, blockFields);
    const { permissionToEditItems, permissionToAddItems } = useQuoteItemPermissions(user, isSupplierRoute);
    const handleCellClick = useCallback((params, event) => {
        if (blockFields)
            return;
        if (params.field === "indisponivel")
            return;
        if (params.row.indisponivel) {
            dispatch(setFeedback({
                message: `O item ${params.row.produto_descricao} nao pode ser editado pois esta indisponivel`,
                type: "error",
            }));
            return;
        }
        if (!params.isEditable) {
            dispatch(setFeedback({
                message: `O campo selecionado não é editável`,
                type: "error",
            }));
            return;
        }
        if (!permissionToEditItems) {
            dispatch(setFeedback({
                type: "error",
                message: "Vocé nao tem permissão para editar o item.",
            }));
            return;
        }
        if (event.target.nodeType === 1 &&
            !event.currentTarget.contains(event.target)) {
            return;
        }
        setCellModesModel((prevModel) => ({
            ...Object.keys(prevModel).reduce((acc, id) => ({
                ...acc,
                [id]: Object.keys(prevModel[id]).reduce((acc2, field) => ({
                    ...acc2,
                    [field]: { mode: GridCellModes.View },
                }), {}),
            }), {}),
            [params.id]: {
                ...Object.keys(prevModel[params.id] || {}).reduce((acc, field) => ({
                    ...acc,
                    [field]: { mode: GridCellModes.View },
                }), {}),
                [params.field]: { mode: GridCellModes.Edit },
            },
        }));
    }, [dispatch, permissionToEditItems]);
    const handleCellModesModelChange = useCallback((newModel) => {
        setCellModesModel(newModel);
    }, []);
    /**
     * Atualiza um item da cotação.
     * Verifica se a quantidade cotada  maior que a quantidade solicitada,
     * se a quantidade cotada   menor que zero, e se o pre o unit rio est  zerado.
     *
     * @param {Object} payload - Payload com campos para atualizar o item da cota o.
     * @param {number} id_item_cotacao - ID do item da cota o.
     * @param {Object} previousItem - Item da cotacaoo anterior para restaurar se houver erros.
     */
    const sendUpdate = async (payload, id_item_cotacao, previousItem) => {
        const validations = [
            {
                condition: payload.quantidade_cotada > payload.quantidade_solicitada,
                message: `Quantidade cotada maior que quantidade solicitada`,
            },
            {
                condition: payload.quantidade_cotada < 0,
                message: `Quantidade cotada menor que zero`,
            },
        ];
        try {
            validations.forEach((validation) => {
                if (validation.condition) {
                    throw new Error(validation.message);
                }
            });
            if (token) {
                const updatedItem = await QuoteItemService.update(id_item_cotacao, payload, token);
                dispatch(setSingleQuoteItem(updatedItem));
                return;
            }
            const updatedItem = await QuoteItemService.update(id_item_cotacao, payload);
            dispatch(setSingleQuoteItem(updatedItem));
        }
        catch (e) {
            dispatch(setSingleQuoteItem({ ...previousItem }));
            dispatch(setFeedback({
                message: `Erro ao atualizar item da cotação: ${e.message}`,
                type: "error",
            }));
            return;
        }
        finally {
            setBlockFields(false);
        }
    };
    const debouncedSave = useMemo(() => debounce(sendUpdate, 300), []);
    const processRowUpdate = useCallback(async (newRow, oldRow) => {
        const payload = {
            quantidade_cotada: newRow.quantidade_cotada,
            ICMS: Number(newRow.ICMS),
            IPI: Number(newRow.IPI),
            ST: Number(newRow.ST),
            observacao: newRow.observacao,
            preco_unitario: newRow.preco_unitario,
            id_cotacao: Number(newRow.id_cotacao),
            id_item_requisicao: Number(newRow.id_item_requisicao),
        };
        try {
            debouncedSave(payload, newRow.id_item_cotacao, oldRow);
            return newRow;
        }
        catch (e) {
            dispatch(setFeedback({
                message: `Erro ao atualizar item da cotação: ${e.message}`,
                type: "error",
            }));
            return oldRow;
        }
    }, [dispatch]);
    const changeSearchTerm = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };
    const debouncedHandleChangeSearchTerm = debounce(changeSearchTerm, 500);
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                id_cotacao: quote?.id_cotacao, // Adjust to your quotation state property
                searchTerm,
            };
            if (token) {
                const data = await QuoteItemService.getMany(params, token);
                dispatch(setQuoteItems(data));
                return;
            }
            const data = await QuoteItemService.getMany(params);
            dispatch(setQuoteItems(data));
        }
        catch (e) {
            dispatch(setFeedback({
                message: "Erro ao buscar itens da cotação",
                type: "error",
            }));
        }
        finally {
            setLoading(false);
        }
    }, [dispatch, quote?.id_cotacao, searchTerm]);
    useEffect(() => {
        if (quote?.id_cotacao) {
            fetchData();
        }
    }, [fetchData, quote?.id_cotacao]);
    return (_jsxs(Box, { children: [_jsx(BaseTableToolBar, { handleChangeSearchTerm: debouncedHandleChangeSearchTerm, children: permissionToAddItems && (_jsx(Button, { variant: "contained", onClick: () => {
                        dispatch(setAddingReqItems(true));
                    }, children: "Adicionar itens" })) }), _jsx(Box, { sx: { height: tableMaxHeight ? tableMaxHeight : "auto" }, children: _jsx(BaseDataTable, { density: "compact", disableColumnMenu: true, getRowId: (row) => row.id_item_cotacao, loading: loading, theme: theme, rows: quoteItems, columns: columns, cellModesModel: cellModesModel, onCellModesModelChange: handleCellModesModelChange, onCellClick: handleCellClick, processRowUpdate: processRowUpdate, hideFooter: hideFooter }) }), _jsxs(Dialog, { open: addingReqItems, fullWidth: true, onClose: () => dispatch(setAddingReqItems(false)), children: [_jsx(DialogTitle, { children: "Adicionar itens" }), _jsxs(DialogContent, { children: [_jsx(IconButton, { sx: { position: "absolute", top: 0, right: 0 }, color: "error", onClick: () => dispatch(setAddingReqItems(false)), children: _jsx(CloseIcon, {}) }), addingReqItems && _jsx(RequisitionItemsTable, { hideFooter: true })] })] })] }));
};
export default QuoteItemsTable;
