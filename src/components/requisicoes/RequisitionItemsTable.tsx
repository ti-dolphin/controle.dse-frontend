import {
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridRowModel,
  GridRowSelectionModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { useRequisitionItemColumns } from "../../hooks/requisicoes/RequisitionItemColumnsHook";
import { RequisitionItem } from "../../models/requisicoes/RequisitionItem";
import { Box, Button, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
import BaseDataTable from "../shared/BaseDataTable";
import BaseTableToolBar from "../shared/BaseTableToolBar";
import { debounce } from "lodash";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useRequisitionItemPermissions } from "../../hooks/requisicoes/RequisitionItemPermissionsHook";
import {
  setCurrentQuoteIdSelected,
  setProductsAdded,
  setRefresh,
  setSelectedQuote,
} from "../../redux/slices/requisicoes/requisitionItemSlice";
import QuoteService from "../../services/requisicoes/QuoteService";
import { useNavigate, useParams } from "react-router-dom";
import { Quote } from "../../models/requisicoes/Quote";
import { QuoteItemService } from "../../services/requisicoes/QuoteItemService";
import {
  setAddingReqItems,
  setQuoteItems,
} from "../../redux/slices/requisicoes/quoteItemSlice";

import {
  setRefreshRequisition,
  setRequisition,
} from "../../redux/slices/requisicoes/requisitionSlice";
import { formatDateStringtoISOstring } from "../../utils";
import RequisitionService from "../../services/requisicoes/RequisitionService";

interface RequisitionItemsTable { 
    tableMaxHeight?: number;
    hideFooter: boolean
}
const RequisitionItemsTable = ({ tableMaxHeight, hideFooter }: RequisitionItemsTable) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { id_requisicao } = useParams();

  const { requisition, refreshRequisition } = useSelector(
    (state: RootState) => state.requisition
  );

  const gridApiRef = useGridApiRef();
  const quote = useSelector((state: RootState) => state.quote.quote);

  const quoteItems = useSelector(
    (state: RootState) => state.quoteItem.quoteItems
  );

  const addingReqItems = useSelector(
    (state: RootState) => state.quoteItem.addingReqItems
  );

  const user = useSelector((state: RootState) => state.user.user);

  const { editItemFieldsPermitted,
      createQuotePermitted, } = useRequisitionItemPermissions(
    user,
    requisition
  );

  const { newItems, updatingRecentProductsQuantity, refresh, currentQuoteIdSelected, selectedQuote } = useSelector(
    (state: RootState) => state.requisitionItem
  );
  const handleDeleteItem = async (id_item_requisicao: number) => {
    setBlockFields(true);
    try {
      //atualiza UI imediatamente
      const updatedItems = items.filter(
        (item) => item.id_item_requisicao !== id_item_requisicao
      );
      setItems(updatedItems);
      await RequisitionItemService.delete(id_item_requisicao);
      dispatch(setRefreshRequisition(!refreshRequisition));
      dispatch(setProductsAdded(updatedItems.map((item) => item.id_produto)));
      setBlockFields(false);
      return;
    } catch (e: any) {
      dispatch(setRefreshRequisition(!refreshRequisition));
      dispatch(
        setFeedback({ message: "Erro ao excluir itens", type: "error" })
      );
      setBlockFields(false);
    }
  };

  const handleFillOCS = async (ocValue: number) => {
    try {
      const itemsWithOC = await RequisitionItemService.updateOCS(
        selectionModel as number[],
        ocValue
      );
      if (itemsWithOC) {
        setSelectionModel([]);
        dispatch(setRefresh(!refresh));
      }
    } catch (e: any) {
      dispatch(setFeedback({ message: "Erro ao preencher OC", type: "error" }));
    }
  };
  //PREENCHER DATA DE ENTREGA DOS ITENS SELECIONADOS
  const handleFillShippingDate = async (date: string) => {
    if (!date) {
      dispatch(
        setFeedback({
          message: "Data inválida ou no formato errado",
          type: "error",
        })
      );
      return;
    }
    if (date) {
      const isoDate = formatDateStringtoISOstring(date);
      try {
        const itemsWithShippingDate =
          await RequisitionItemService.updateShippingDate(
            selectionModel as number[],
            isoDate
          );
        if (itemsWithShippingDate) {
          setSelectionModel([]);
          dispatch(setRefresh(!refresh));
        }
      } catch (e) {
        dispatch(
          setFeedback({
            message: "Erro ao preencher data de entrega",
            type: "error",
          })
        );
      }
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<RequisitionItem[]>([]);
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
  const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const [quoteItemsSelected, setQuoteItemsSelected] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(false);
  const [blockFields, setBlockFields] = useState(false);
  //map de <id_item_requisicao, id_item_cotacao>
  //SELECIONA ITEMS DA COTAÇÃO
  const handleChangeQuoteItemsSelected = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      id_item_cotacao: number,
      id_item_requisicao: number
    ) => {
      if (e.target.checked) {
        setQuoteItemsSelected(
          new Map(quoteItemsSelected.set(id_item_requisicao, id_item_cotacao))
        );
        const { updatedItems, updatedRequisition } =
          await RequisitionItemService.updateQuoteItemsSelected(
            Number(id_requisicao),
            Object.fromEntries(quoteItemsSelected)
          );
        setItems(updatedItems);
        dispatch(setRequisition(updatedRequisition));
        return;
      }
      quoteItemsSelected.delete(id_item_requisicao);
      setQuoteItemsSelected(new Map(quoteItemsSelected));
      const { updatedItems, updatedRequisition } =
        await RequisitionItemService.updateQuoteItemsSelected(
          Number(id_requisicao),
          Object.fromEntries(quoteItemsSelected)
        );
      setItems(updatedItems);
      dispatch(setRequisition(updatedRequisition));
    },
    [quoteItemsSelected, requisition, setItems]
  );

  const toolbarRef = React.useRef<HTMLDivElement>(null);

  //CRIA E RENDERIZA AS COLUNAS DA TABELA COM FUNCOES
  const { columns, isDinamicField } = useRequisitionItemColumns(
    addingReqItems,
    editItemFieldsPermitted,
    handleDeleteItem,
    handleFillOCS,
    handleFillShippingDate,
    handleChangeQuoteItemsSelected,
    quoteItemsSelected,
    selectionModel as number[],
    blockFields
  );
  //CLIQUE NA CÈLULA
  const handleCellClick = (params: GridCellParams, event: React.MouseEvent) => {
    if (isDinamicField && isDinamicField(params.field)) {
      return;
    }
    if (params.field === "__check__") return;
    if (params.field === "actions") return;

    if (!params.isEditable) {
      dispatch(
        setFeedback({
          message: `O campo selecionado não é editável`,
          type: "error",
        })
      );
      return;
    }

    if (!editItemFieldsPermitted) {
      dispatch(
        setFeedback({
          message: `Você não tem permissão para editar este campo`,
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
        // Revert the mode of the other cells from other rows
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
          // Revert the mode of other cells in the same row
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
  };
  //PROCESSA MUDANÇA DE ESTADO DA CÉLULA "EDIT", "VIEW"
  const handleCellModesModelChange = React.useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    []
  );
  //ATUALIZA LINHA NO BACKEND
  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel, oldRow: GridRowModel) => {
      const payload = {
        id_item_requisicao: newRow.id_item_requisicao,
        quantidade: newRow.quantidade,
        data_entrega: newRow.data_entrega,
        oc: newRow.oc,
        observacao: newRow.observacao,
      };
      try {
        const updatedItem = await RequisitionItemService.update(
          newRow.id_item_requisicao,
          payload
        );
        return updatedItem;
      } catch (e: any) {
        dispatch(
          setFeedback({
            message: `Erro ao atualizar item da requisição: ${e.message}`,
            type: "error",
          })
        );
        return oldRow;
      }
    },
    [items, dispatch]
  );
  //CRIA A COTAÇÃO A PARTIR DOS ITENS SELECIONADOS
  const createQuoteFromSelectedItems = async () => {
    //create quote from items and then redirect to quote page
    const quote: Quote = await QuoteService.create({
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
          quantidade_solicitada:
            items.find((item) => item.id_item_requisicao === id_item_requisicao)
              ?.quantidade || 0,
          quantidade_cotada:
            items.find((item) => item.id_item_requisicao === id_item_requisicao)
              ?.quantidade || 0,
          descricao_item: "",
          preco_unitario: 0,
        }));

        const incrementedQuoteItems = await QuoteItemService.create(
          newQuoteItems
        );
        dispatch(setQuoteItems(incrementedQuoteItems));
        dispatch(setAddingReqItems(false));
        dispatch(
          setFeedback({
            message: "Itens adicionados com sucesso à cotação",
            type: "success",
          })
        );
      } catch (e: any) {
        dispatch(
          setFeedback({ message: "Erro ao adicionar itens", type: "error" })
        );
      }
    }
  };
  //SELECIONA ou DESELECIONA UMA LINHA
  const handleChangeSelection = async (
    newRowSelectionModel: GridRowSelectionModel,
  ) => {
    if (!(editItemFieldsPermitted || addingReqItems)) {
      dispatch(
        setFeedback({
          message: "Vocé não tem permissão para editar itens",
          type: "error",
        })
      );
      return;
    }
    if (addingReqItems) {
      const itemsInQuoteItems = quoteItems.map(
        (item) => item.id_item_requisicao
      );
      if (itemsInQuoteItems.includes(Number(newRowSelectionModel[0]))) {
        dispatch(
          setFeedback({
            message: "Vocé nao pode selecionar itens que ja estao na cotação",
            type: "error",
          })
        );
        return;
      }
    }
    setSelectionModel(newRowSelectionModel);
  };
  //MUDA O TERMO DE BUSCA
  const changeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value.toLowerCase());
  };
  //DEBOUNCED
  const debouncedHandleChangeSearchTerm = debounce(changeSearchTerm, 500);
  //BUSCA ITENS DA REQUISIÇÃO
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        newItems.length > 0
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
    } catch (e) {
      setLoading(false);
      dispatch(
        setFeedback({
          message: "Erro ao buscar itens da requisição",
          type: "error",
        })
      );
    }
  }, [dispatch, requisition.ID_REQUISICAO, searchTerm, newItems]);

  //CONFIGURA O MAPA DE ITENS DE COTAÇÃO  SELECIONADOS POR ITENS DE REQUISIÇÃO
  const defineSelectedQuoteItemsMap = (items: RequisitionItem[]) => {
    // const map = new Map<number, number>();
    items.forEach((item) => {
      if (item.id_item_cotacao) {
        quoteItemsSelected.set(item.id_item_requisicao, item.id_item_cotacao);
      }
    });
  };

  const fetchQuoteSelected = async () => {
    if (!currentQuoteIdSelected) return;
    try {
     
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Erro ao buscar cotação selecionada",
          type: "error",
        })
      );
    }
  };

  const handleChangeQuoteSelected = useCallback(
  async  () => {
      if (currentQuoteIdSelected) {
         const quote : Partial<Quote> = await QuoteService.getById(currentQuoteIdSelected);
        if (quote && quote.items) {
          const quoteItems  = quote.items.map((item) => item.id_item_cotacao);
          const itemIds = items.filter((item) => quoteItems.includes(item.id_item_cotacao || 0)).map((item) => item.id_item_requisicao);
          setSelectionModel(itemIds);
          dispatch(setSelectedQuote(quote));
          return;
        }
      }
      setSelectionModel([]);
    },
    [currentQuoteIdSelected, quoteItems]
  );

  const createParcialReq = async () => {
    try {
      setLoading(true);
      const newRequisition = await RequisitionService.createFromOther(requisition.ID_REQUISICAO, selectionModel as number[]);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      dispatch(
        setFeedback({
          message: "Erro ao criar requisição parcial",
          type: "error",
        })
      );
    }
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

  useEffect(() => {
    handleChangeQuoteSelected();
  }, [handleChangeQuoteSelected]);

  useEffect(() =>  {

  }, [currentQuoteIdSelected])

  return (
    <Box>
      {selectionModel.length > 0 && (
        <Box sx={{ p: 1, display: "flex", gap: 1 }}>
          {!addingReqItems &&
            !updatingRecentProductsQuantity &&
            createQuotePermitted && (
              <Button
                variant="contained"
                onClick={createQuoteFromSelectedItems}
              >
                Criar cotação
              </Button>
            )}
          {!addingReqItems &&
            !updatingRecentProductsQuantity &&
            selectedQuote && (
              <Button variant="contained" onClick={createParcialReq}>
                Criar requisição parcial
              </Button>
            )}
        </Box>
      )}
      <BaseTableToolBar
        ref={toolbarRef}
        handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
      />
      <Box sx={{ height: tableMaxHeight ? tableMaxHeight : "auto" }}>
        <BaseDataTable
          apiRef={gridApiRef}
          density="compact"
          getRowId={(row: any) => row.id_item_requisicao}
          loading={loading}
          theme={theme}
          disableColumnMenu
          rows={items}
          checkboxSelection
          onRowSelectionModelChange={handleChangeSelection}
          rowSelectionModel={selectionModel}
          disableRowSelectionOnClick
          columns={columns}
          cellModesModel={cellModesModel}
          onCellModesModelChange={handleCellModesModelChange}
          onCellClick={handleCellClick}
          processRowUpdate={processRowUpdate}
          hideFooter={hideFooter}
        />
      </Box>
      {addingReqItems && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button variant="contained" onClick={handleAddItemsToRequisition}>
            Adicionar itens
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RequisitionItemsTable;
