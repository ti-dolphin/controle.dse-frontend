import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  GridCellModesModel,
  GridCellParams,
  GridCellModes,
  GridRowModel,
  GridColDef,
} from "@mui/x-data-grid";
import { useState, useCallback, useEffect, ChangeEvent } from "react";
import { QuoteItem } from "../../models/requisicoes/QuoteItem";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { QuoteItemService } from "../../services/requisicoes/QuoteItemService";
import BaseDataTable from "../shared/BaseDataTable";
import BaseTableToolBar from "../shared/BaseTableToolBar";
import { debounce } from "lodash";
import { useQuoteItemColumns } from "../../hooks/requisicoes/QuoteItemColumnsHoook";
import { useQuoteItemPermissions } from "../../hooks/requisicoes/QuoteItemPermissionsHook";
import RequisitionItemsTable from "./RequisitionItemsTable";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { Requisition } from "../../models/requisicoes/Requisition";
import CloseIcon from '@mui/icons-material/Close';
import { setAddingReqItems, setQuoteItems } from "../../redux/slices/requisicoes/quoteItemSlice";

const QuoteItemsTable = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const theme = useTheme();
  const {quote} = useSelector((state: RootState) => state.quote);
  const { quoteItems, addingReqItems } = useSelector((state: RootState) => state.quoteItem);
  const [searchTerm, setSearchTerm] = useState("");
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const [loading, setLoading] = useState(false);

  const isSupplierRoute = window.location.pathname.includes("/supplier/requisicoes");

  const handleUpdateUnavailable = async (e: ChangeEvent<HTMLInputElement>, itemId : number) => {
    const item = quoteItems.find((item) => item.id_item_cotacao === itemId);
    if(!item) return
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
    const updatedItem = await QuoteItemService.update(itemId, payload); 
    dispatch(
      setQuoteItems(
        quoteItems.map((item) =>
          item.id_item_cotacao === updatedItem.id_item_cotacao
            ? updatedItem
            : item
        )
      )
    );
  };

  const { columns } = useQuoteItemColumns(handleUpdateUnavailable);

  const { permissionToEditItems, permissionToAddItems} = useQuoteItemPermissions(
    user,
    isSupplierRoute
  );
  
  const handleCellClick = useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      console.log(params.row);

      if (params.field === "indisponivel") return;

      if(params.row.indisponivel) { 
        dispatch(
          setFeedback({
            message: `O item ${params.row.produto_descricao} nao pode ser editado pois esta indisponivel`,
            type: "error",
          }));
        return
      }
     
      if (!params.isEditable) {
        dispatch(
          setFeedback({
            message: `O campo selecionado não é editável`,
            type: "error",
          })
        );
        return;
      }

      if (!permissionToEditItems) {
        dispatch(
          setFeedback({
            type: "error",
            message: "Vocé nao tem permissão para editar o item.",
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
      setCellModesModel((prevModel) => ({
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
      }));
    },
    [dispatch, permissionToEditItems]
  );

  const handleCellModesModelChange = useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    []
  );

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel, oldRow: GridRowModel) => {
      
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
      const validations = [
        {
          condition: payload.quantidade_cotada > newRow.quantidade_solicitada,
          message: `Quantidade cotada maior que quantidade solicitada`,
        },
        {
          condition: payload.quantidade_cotada < 0,
          message: `Quantidade cotada menor que zero`,
        },
        {
          condition: !(payload.preco_unitario > 0),
          message: `Preço unitário zerado, marque como indisponível se não houver o produto`,
        },
      ];
      try {
        validations.forEach((validation) => {
          if (validation.condition) {
            throw new Error(validation.message);
          }
        });
        const updatedItem = await QuoteItemService.update(
          newRow.id_item_cotacao,
          payload
        );
        return updatedItem;
      } catch (e: any) {
        dispatch(
          setFeedback({
            message: `Erro ao atualizar item da cotação: ${e.message}`,
            type: "error",
          })
        );
        return oldRow;
      }
    },
    [dispatch]
  );

  const changeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const data = await QuoteItemService.getMany(params);

      dispatch(setQuoteItems(data));
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Erro ao buscar itens da cotação",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, quote?.id_cotacao, searchTerm]);

  useEffect(() => {
    if (quote?.id_cotacao) {
      fetchData();
    }
  }, [fetchData, quote?.id_cotacao]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h6" color="primary.main">
          Itens da cotação
        </Typography>
        {permissionToAddItems && (
          <Button
            variant="contained"
            onClick={() => {
              dispatch(setAddingReqItems(true));
            }}
          >
            Adicionar itens
          </Button>
        )}
      </Box>
      <BaseTableToolBar
        handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
      />
      <BaseDataTable
        density="compact"
        disableColumnMenu
        getRowId={(row: any) => row.id_item_cotacao}
        loading={loading}
        theme={theme}
        rows={quoteItems}
        columns={columns}
        
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
        processRowUpdate={processRowUpdate}
        hideFooter
      />

      <Dialog
        open={addingReqItems}
        fullWidth
        onClose={() => dispatch(setAddingReqItems(false))}
      >
        <DialogTitle>Adicionar itens</DialogTitle>
        <DialogContent>
          <IconButton
            sx={{ position: "absolute", top: 0, right: 0 }}
            color="error"
            onClick={() => dispatch(setAddingReqItems(false))}
          >
            <CloseIcon />
          </IconButton>
          {addingReqItems && <RequisitionItemsTable />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default QuoteItemsTable;
