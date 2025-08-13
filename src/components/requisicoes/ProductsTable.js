import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GridCellModes, } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import BaseDataTable from "../shared/BaseDataTable";
import BaseTableToolBar from "../shared/BaseTableToolBar";
import { debounce } from "lodash";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useProductPermissions } from "../../hooks/productPermissionsHook";
import { ProductService } from "../../services/ProductService";
import { setProductSelected, setRecentAddedProducts } from "../../redux/slices/requisicoes/requisitionItemSlice";
import { useProductColumns } from "../../hooks/productColumnsHook";
const ProductsTable = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const user = useSelector((state) => state.user.user);
    const { addingProducts, recentProductsAdded, productsAdded, replacingItemProduct } = useSelector((state) => state.requisitionItem);
    const { editProductFieldsPermitted } = useProductPermissions(user);
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [cellModesModel, setCellModesModel] = React.useState({});
    const [loading, setLoading] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const { columns } = useProductColumns();
    const handleCellClick = React.useCallback((params, event) => {
        if (params.field === "__check__")
            return;
        if (!params.isEditable) {
            dispatch(setFeedback({
                message: "O campo selecionado não é editável",
                type: "error",
            }));
            return;
        }
        if (!editProductFieldsPermitted) {
            dispatch(setFeedback({
                message: "Você não tem permissão para editar este campo",
                type: "error",
            }));
            return;
        }
        if (addingProducts) {
            dispatch(setFeedback({
                message: "Você não pode alterar os camops do produto nesse momento",
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
            };
        });
    }, [dispatch, editProductFieldsPermitted]);
    const handleChangeSelection = async (newRowSelectionModel) => {
        if (replacingItemProduct) {
            setRowSelectionModel(newRowSelectionModel);
            dispatch(setProductSelected(Number(newRowSelectionModel[0])));
            return;
        }
        if (productsAdded.includes(Number(newRowSelectionModel[0]))) {
            dispatch(setFeedback({ message: 'O produto ja foi adicionado a requisição', type: 'error' }));
            return;
        }
        dispatch(setRecentAddedProducts(newRowSelectionModel));
    };
    //Processa mudança de modo, edição ou visualização
    const handleCellModesModelChange = React.useCallback((newModel) => {
        setCellModesModel(newModel);
    }, []);
    // após clicar fora da célula ou pressionar enter, essa função é chamda
    //para salvar as mudanças
    const processRowUpdate = React.useCallback(async (newRow, oldRow) => {
        const payload = {
            unidade: newRow.unidade,
            quantidade_estoque: newRow.quantidade_estoque,
        };
        try {
            const updatedProduct = await ProductService.update(newRow.ID, payload);
            setProducts((prevProducts) => prevProducts.map((product) => product.ID === updatedProduct.ID ? updatedProduct : product));
            return updatedProduct;
        }
        catch (error) {
            setLoading(false);
            dispatch(setFeedback({
                message: "Erro ao atualizar produto",
                type: "error",
            }));
            return oldRow;
        }
    }, [dispatch]);
    //muda o termo de busca
    const changeSearchTerm = (e) => {
        const value = e.target.value;
        setSearchTerm(value.toLowerCase());
    };
    const getRowSelectionModelForContext = () => {
        return addingProducts ? recentProductsAdded : rowSelectionModel;
    };
    //faz debounce na mudançda da busca
    const debouncedHandleChangeSearchTerm = debounce(changeSearchTerm, 500);
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ProductService.getMany({ searchTerm });
            setProducts(data);
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            dispatch(setFeedback({
                message: "Erro ao buscar produtos",
                type: "error",
            }));
        }
    }, [dispatch, searchTerm]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return (_jsxs(Box, { children: [_jsx(BaseTableToolBar, { handleChangeSearchTerm: debouncedHandleChangeSearchTerm }), _jsx(BaseDataTable, { density: "compact", rowSelection: true, rowSelectionModel: getRowSelectionModelForContext(), disableRowSelectionOnClick: true, disableColumnMenu: true, sx: {
                    '& .MuiDataGrid-columnHeaders': {
                        '& .MuiCheckbox-root': {
                            display: 'none'
                        }
                    }
                }, disableColumnFilter: true, disableMultipleRowSelection: replacingItemProduct, onRowSelectionModelChange: handleChangeSelection, checkboxSelection: true, getRowId: (row) => row.ID, loading: loading, theme: theme, rows: products, columns: columns, cellModesModel: cellModesModel, initialState: {
                    pagination: { paginationModel: { pageSize: 20 } },
                }, pageSizeOptions: [20], onCellModesModelChange: handleCellModesModelChange, onCellClick: handleCellClick, processRowUpdate: processRowUpdate })] }));
};
export default ProductsTable;
