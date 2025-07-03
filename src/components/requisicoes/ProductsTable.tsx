import {
  GridCallbackDetails,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridRowModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { Product } from "../../models/Product";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import BaseDataTable from "../shared/BaseDataTable";
import BaseTableToolBar from "../shared/BaseTableToolBar";
import { debounce } from "lodash";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useProductPermissions } from "../../hooks/productPermissionsHook";
import { ProductService } from "../../services/ProductService";
import { setRecentAddedProducts } from "../../redux/slices/requisicoes/requisitionItemSlice";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";

const ProductsTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user.user);

  const { addingProducts, recentProductsAdded} = useSelector((state: RootState) => state.requisitionItem);
  const requisition = useSelector((state: RootState) => state.requisition.requisition);

  const { editProductFieldsPermitted } = useProductPermissions(user);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cellModesModel, setCellModesModel]  = React.useState<GridCellModesModel>({});
  const [loading, setLoading] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

  const columns: GridColDef[] = [
    {
      field: "ID",
      headerName: "ID",
      type: "number",
      flex: 0.2,
      editable: false,
    },
    {
      field: "codigo",
      headerName: "Código Produto",
      type: "string",
      flex: 0.5,
      editable: false,
      valueGetter: (value) => value || "",
    },
    {
      field: "descricao",
      headerName: "Descrição",
      type: "string",
      flex: 1,
      editable: true,
      valueGetter: (value) => value || "",
    },
    {
      field: "unidade",
      headerName: "Unidade",
      type: "string",
      flex: 0.4,
      editable: true,
      valueGetter: (value) => value || "",
    },
    {
      field: "quantidade_estoque",
      headerName: "Quantidade em Estoque",
      type: "number",
      flex: 0.4,
      editable: true,
      valueGetter: (value) => value || 0,
    },
  ];

  const handleCellClick = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (params.field === "__check__") return;
      if (!params.isEditable) {
        dispatch(
          setFeedback({
            message: "O campo selecionado não é editável",
            type: "error",
          })
        );
        return;
      }
      if (!editProductFieldsPermitted) {
        dispatch(
          setFeedback({
            message: "Você não tem permissão para editar este campo",
            type: "error",
          })
        );
        return;
      }
      if (addingProducts) {
        dispatch(
          setFeedback({
            message: "Você não pode alterar os camops do produto nesse momento",
            type: "error",
          })
        );
        return;
      }
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }
      setCellModesModel((prevModel) => {
        return {
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    [dispatch, editProductFieldsPermitted]
  );

  const handleChangeSelection = async (
    newRowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails
  ) => {
    dispatch(setRecentAddedProducts(newRowSelectionModel as number[]));
  };


  //Processa mudança de modo, edição ou visualização
  const handleCellModesModelChange = React.useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    []
  );
// após clicar fora da célula ou pressionar enter, essa função é chamda
//para salvar as mudanças
  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel, oldRow: GridRowModel) => {
      const payload = {
        unidade: newRow.unidade,
        quantidade_estoque: newRow.quantidade_estoque,
      };
      try {
        const updatedProduct = await ProductService.update(newRow.ID, payload);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.ID === updatedProduct.ID ? updatedProduct : product
          )
        );
        return updatedProduct;
      } catch (error) {
        setLoading(false);
        dispatch(
          setFeedback({
            message: "Erro ao atualizar produto",
            type: "error",
          })
        );
        return oldRow;
      }
    },
    [dispatch]
  );
  //muda o termo de busca
  const changeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value.toLowerCase());
  };
  //faz debounce na mudançda da busca
  const debouncedHandleChangeSearchTerm = debounce(changeSearchTerm, 500);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProductService.getMany({ searchTerm });
      setProducts(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      dispatch(
        setFeedback({
          message: "Erro ao buscar produtos",
          type: "error",
        })
      );
    }
  }, [dispatch, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box>
      <BaseTableToolBar
        handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
      />
      <BaseDataTable
        density="compact"
        rowSelection
        rowSelectionModel={recentProductsAdded}
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnFilter
        onRowSelectionModelChange={handleChangeSelection}
        checkboxSelection
        getRowId={(row: any) => row.ID}
        loading={loading}
        theme={theme}
        rows={products}
        columns={columns}
        cellModesModel={cellModesModel}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[20]}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
        processRowUpdate={processRowUpdate}
      />
    </Box>
  );
};

export default ProductsTable;
