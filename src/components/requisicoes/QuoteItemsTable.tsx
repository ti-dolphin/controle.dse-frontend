import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { GridCellModesModel, GridCellParams, GridCellModes, GridRowModel, GridColDef } from "@mui/x-data-grid";
import { useState, useCallback, useEffect } from "react";
import { QuoteItem } from "../../models/requisicoes/QuoteItem";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { QuoteItemService } from "../../services/requisicoes/QuoteItemService";
import BaseDataTable from "../shared/BaseDataTable";
import BaseTableToolBar from "../shared/BaseTableToolBar";
import { debounce } from "lodash";

const QuoteItemsTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const quote = useSelector((state: RootState) => state.quote.quote);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const [loading, setLoading] = useState(false);

  const columns: GridColDef[] = [
    {
      field: "produto_descricao",
      headerName: "Descrição do Produto",
      flex: 1,
      editable: false,
    },
    {
      field: "produto_unidade",
      headerName: "Unidade",
      width: 100,
      editable: false,
    },
    {
      field: "quantidade_solicitada",
      headerName: "Qtde. Solicitada",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "quantidade_cotada",
      headerName: "Qtde. Cotada",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "ICMS",
      headerName: "ICMS (%)",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "IPI",
      headerName: "IPI (%)",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "ST",
      headerName: "ST (%)",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      width: 120,
      editable: false,
    },
    {
      field: "observacao",
      headerName: "Observação",
      flex: 1,
      editable: true,
    },
  ];

  const handleCellClick = useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        dispatch(
          setFeedback({
            message: `O campo selecionado não é editável`,
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
    [dispatch]
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
        id_item_cotacao: newRow.id_item_cotacao,
        quantidade_solicitada: newRow.quantidade_solicitada,
        quantidade_cotada: newRow.quantidade_cotada,
        ICMS: newRow.ICMS,
        IPI: newRow.IPI,
        ST: newRow.ST,
        observacao: newRow.observacao,
      };
      try {
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
      setItems(data);
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
      <BaseTableToolBar
        handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
      />
      <BaseDataTable
        density="compact"
        getRowId={(row: any) => row.id_item_cotacao}
        loading={loading}
        theme={theme}
        rows={items}
        columns={columns}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
        processRowUpdate={processRowUpdate}
        hideFooter
      />
    </Box>
  );
};

export default QuoteItemsTable;