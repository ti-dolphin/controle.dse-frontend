import {
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridCloseIcon,
  GridRowModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { Product } from "../../models/Product";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import BaseDataTable from "../shared/BaseDataTable";
import BaseTableToolBar from "../shared/BaseTableToolBar";
import { debounce } from "lodash";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useProductPermissions } from "../../hooks/productPermissionsHook";
import { ProductService } from "../../services/ProductService";
import { setProductSelected, setRecentAddedProducts } from "../../redux/slices/requisicoes/requisitionItemSlice";
import EditIcon from "@mui/icons-material/Edit";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useProductColumns } from "../../hooks/productColumnsHook";
import ProductAttachmentList from "../ProductAttachmentList";
import { setViewingProductAttachment } from "../../redux/slices/productSlice";
import { FixedSizeGrid } from "react-window";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { green, red } from "@mui/material/colors";
import ProductCard from "./ProductCard";
const ProductsTable = () => {

  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const { addingProducts, recentProductsAdded, productsAdded, replacingItemProduct} = useSelector((state: RootState) => state.requisitionItem);
  const { editProductFieldsPermitted } = useProductPermissions(user);
  const {viewingProductAttachment  } = useSelector((state: RootState) => state.productSlice);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cellModesModel, setCellModesModel]  = React.useState<GridCellModesModel>({});
  const [loading, setLoading] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const { isMobile } = useIsMobile();
  const { columns } = useProductColumns();
  const [productBeingEdited, setProductBeingEdited] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const gridContainerRef = React.useRef<HTMLDivElement>(null);

  const handleCellClick = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (params.field === "__check__") return;
      if(params.field === 'anexos') return;
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
    newRowSelectionModel: GridRowSelectionModel  ) => {
    if(replacingItemProduct){ 
      setRowSelectionModel(newRowSelectionModel);
      dispatch(setProductSelected(Number(newRowSelectionModel[0])));
      return;
    }

    if (productsAdded.includes(Number(newRowSelectionModel[0]))){ 
      dispatch(setFeedback({ message: 'O produto ja foi adicionado a requisição', type: 'error' }));
      return;
    }
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
  const getRowSelectionModelForContext =( ) => { 
    return addingProducts ? recentProductsAdded : rowSelectionModel;
  };
  //método para dar update na quantidade em estoque no mobile
  const saveProductQuantity = async (newQuantity: number) => {
    if (!productBeingEdited) return;
    try {
      const updatedProduct = await ProductService.update(
        productBeingEdited.ID,
        { quantidade_estoque: newQuantity }
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.ID === updatedProduct.ID ? updatedProduct : product
        )
      );
      setProductBeingEdited(null);
      setQuantity(0);
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Erro ao atualizar produto",
          type: "error",
        })
      );
    }
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <BaseTableToolBar
        handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
      />
      {isMobile ? (
        <Box
          ref={gridContainerRef}
          sx={{
            flexGrow: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid"
          }}
        >
          <FixedSizeGrid
            rowCount={products.length}
            columnCount={1}
            columnWidth={280}
            height={gridContainerRef.current?.clientHeight || 0}
            rowHeight={290}
            width={300}
          >
            {({ columnIndex, rowIndex, style }) => {
              const row = products[rowIndex];
              return (
                <ProductCard
                  key={row.ID}
                  row={row}
                  setProductBeingEdited={setProductBeingEdited}
                  productBeingEdited={productBeingEdited}
                  saveProductQuantity={saveProductQuantity}
                />
              );
            }}
          </FixedSizeGrid>
        </Box>
      ) : (
        <BaseDataTable
          density="compact"
          rowSelection
          rowSelectionModel={getRowSelectionModelForContext()}
          disableRowSelectionOnClick
          disableColumnMenu
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              "& .MuiCheckbox-root": {
                display: "none",
              },
            },
          }}
          disableColumnFilter
          disableMultipleRowSelection={replacingItemProduct}
          onRowSelectionModelChange={handleChangeSelection}
          checkboxSelection={addingProducts || replacingItemProduct}
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
      )}

      <Dialog
        open={viewingProductAttachment !== null}
        onClose={() => dispatch(setViewingProductAttachment(null))}
        fullWidth
        maxWidth="md"
      >
        <IconButton
          onClick={() => dispatch(setViewingProductAttachment(null))}
          sx={{
            color: "error.main",
            height: 30,
            width: 30,
            position: "absolute",
            top: 4,
            right: 4,
            boxShadow: 3,
          }}
        >
          <GridCloseIcon />
        </IconButton>
        <DialogTitle>Lista de Anexos</DialogTitle>
        <DialogContent>
          <ProductAttachmentList />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductsTable;

