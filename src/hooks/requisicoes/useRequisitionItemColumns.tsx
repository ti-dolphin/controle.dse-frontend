import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { formatCurrency, getDateFromISOstring } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import DeleteIcon from "@mui/icons-material/Delete";
import { Badge, BadgeProps, Box, Checkbox, IconButton, styled, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  setCurrentQuoteIdSelected,
  setItemBeingReplaced,
  setReplacingItemProduct,
  setViewingItemAttachment,
} from "../../redux/slices/requisicoes/requisitionItemSlice";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import FillAllDialog from "../../components/shared/FillAllDialog";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
import { useParams } from "react-router-dom";
import { QuoteItem } from "../../models/requisicoes/QuoteItem";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import FileIcon from '@mui/icons-material/FilePresent';

export const useRequisitionItemColumns = (
  addingReqItems: boolean,
  editItemFieldsPermitted: boolean,
  handleDeleteItem: (id_item_requisicao: number) => Promise<void>,
  handleFillOCS: (ocValue: number) => void,
  handleFillShippingDate: (date: string) => void,
  handleChangeQuoteItemsSelected: (
    e: React.ChangeEvent<HTMLInputElement>,
    id_item_cotacao: number,
    id_item_requisicao: number
  ) => void,
  quoteItemsSelected: Map<number, number>,
  selectionModel: number[],
  blockFields: boolean
) => {

  const dispatch = useDispatch();
  const { id_requisicao } = useParams();
  const [fillingOC, setFillingOC] = useState(false);
  const [ocValue, setOcValue] = useState<number | null>(null);
  const [fillingShippingDate, setFillingShippingDate] = useState(false);
  const [shippingDate, setShippingDate] = useState<string>("");
  const [dinamicColumns, setDinamicColumns] = useState<GridColDef[]>([]);

  const user = useSelector((state: RootState) => state.user.user);

  const { updatingRecentProductsQuantity } = useSelector(
    (state: RootState) => state.requisitionItem
  );

  const attendingItems = useSelector((state: RootState) => state.attendingItemsSlice.attendingItems);

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      padding: "0 4px",
    },
  }));

  const handleSelectQuoteId = (quoteId: number, e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.checked;
    if (selected) {
      dispatch(setCurrentQuoteIdSelected(quoteId));
      return;
    }
    dispatch(setCurrentQuoteIdSelected(null));
  };

  const concludeFillingOC = async () => {
    if (!ocValue) {
      dispatch(
        setFeedback({
          message: "Digite um valor para preencher a OC",
          type: "error",
        })
      );
      return;
    }
    await handleFillOCS(ocValue);
    setOcValue(null);
    setFillingOC(false);
  };

  const concludeFillingShippingDate = async () => {
    if (!shippingDate) {
      dispatch(
        setFeedback({
          message: "Data inválida",
          type: "error",
        })
      );
      return;
    }
    await handleFillShippingDate(shippingDate);
    setShippingDate("");
    setFillingShippingDate(false);
  };

  const handleChangeshippingDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDate(e.target.value);
  };

  const openOCDialog = () => {
    if (!selectionModel.length) {
      dispatch(
        setFeedback({
          message: "Selecione os itens para preencher a OC",
          type: "error",
        })
      );
      return;
    }
    setFillingOC(true);
  };

  const openShippingDateDialog = () => {
    if (!selectionModel.length) {
      dispatch(
        setFeedback({
          message: "Selecione os itens para preencher a data de entrega",
          type: "error",
        })
      );
      return;
    }
    setFillingShippingDate(true);
  };

  const columns: GridColDef[] = [
    {
      field: "id_item_requisicao",
      headerName: "ID",
      type: "number",
      width: 50,
    },
    {
      field: "produto_codigo",
      headerName: "Cód. Produto",
      type: "string",
      width: 100,
    },
    {
      field: "produto_descricao",
      headerName: "Descrição",
      type: "string",
      minWidth: 300,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px" fontWeight="bold">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "quantidade_atendida",
      headerName: "Atender",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "quantidade",
      headerName: attendingItems ? "Quantidade solicitada" : "QTD",
      type: "number",
      editable: attendingItems ? false : true,
      width: attendingItems ? 200 : 100,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            height: "100%",
          }}
        >
          <Typography fontSize="small" fontWeight="bold">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "quantidade_disponivel",
      headerName: "Estoque",
      type: "number",
      width: 100,
      editable: false,
    },
    {
      field: "data_entrega",
      headerName: "Data de entrega",
      width: 150,
      type: "date",
      editable: true,
      minWidth: 100,
      valueGetter: (data_entrega: string) =>
        data_entrega ? getDateFromISOstring(data_entrega) : null,
      renderHeader: () => (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography fontSize="12px" fontWeight="bold" color="primary">
            Data entrega
          </Typography>
          {editItemFieldsPermitted || user?.PERM_COMPRADOR && (
            <Tooltip title="Preencher">
              <IconButton
                onClick={openShippingDateDialog}
                sx={{ height: 0, width: 20 }}
              >
                <ArticleOutlinedIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>
          )}
          {editItemFieldsPermitted && (
            <FillAllDialog
              open={fillingShippingDate}
              onClose={() => setFillingShippingDate(false)}
              onChange={handleChangeshippingDate}
              onConfirm={concludeFillingShippingDate}
              value={shippingDate}
              label="Data de entrega"
              type="date"
              title="Digite a data desejada para preencher todos os itens"
            />
          )}
        </Box>
      ),
    },
    {
      field: "produto_unidade",
      headerName: "Unidade",
      type: "string",
      sortable: false,
      minWidth: 70,
    },
    {
      field: "oc",
      headerName: "OC",
      editable: true,
      type: "string",
      valueGetter: (oc: string) => oc || "",
      minWidth: 100,
      renderHeader: () => (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography fontSize="12px" fontWeight="bold" color="primary">
            OC
          </Typography>
          {editItemFieldsPermitted || user?.PERM_COMPRADOR && (
            <Tooltip title="Preencher">
              <IconButton onClick={openOCDialog} sx={{ height: 20, width: 20 }}>
                <ArticleOutlinedIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>
          )}
          {editItemFieldsPermitted && (
            <FillAllDialog
              open={fillingOC}
              onClose={() => setFillingOC(false)}
              onConfirm={concludeFillingOC}
              value={ocValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOcValue(Number(e.target.value))
              }
              label="Número da OC"
              type="number"
              title="Digite o valor desejado para preencher todos os itens"
            />
          )}
        </Box>
      ),
    },
    {
      field: "observacao",
      headerName: "Observação",
      type: "string",
      editable: true,
      valueGetter: (observacao: string) => observacao || "N/A",
      minWidth: 100,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Typography fontSize="small" fontWeight="bold">
            {params.value}
          </Typography>
          <Tooltip title="Copiar observação">
            <IconButton
              onClick={() => navigator.clipboard.writeText(params.value)}
              sx={{ padding: 0 }}
            >
              <ContentCopyIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      minWidth: 110,
      renderCell: (row) => {
        const { id } = row;
        function setItemBeingViewed(arg0: number): any {
          throw new Error("Function not implemented.");
        }

        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.4,
            }}
          >
            {editItemFieldsPermitted && (
              <Tooltip title="Excluir item">
                <IconButton
                  disabled={blockFields}
                  onClick={() => handleDeleteItem(Number(id))}
                  color="error"
                >
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            )}
            {editItemFieldsPermitted && (
              <Tooltip title="Substituir produto">
                <IconButton
                  onClick={() => {
                    dispatch(setReplacingItemProduct(true));
                    dispatch(setItemBeingReplaced(Number(id)));
                  }}
                  sx={{ color: "primary.main" }}
                >
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            )}
            <IconButton
              onClick={() => {
                dispatch(setViewingItemAttachment(Number(id)));
              }}
              sx={{ height: 24, width: 24 }}
            >
              {row.row.anexos.length > 0 ? (
                <StyledBadge
                  variant="standard"
                  badgeContent={row.row.anexos.length}
                  color="primary"
                >
                  <FileIcon sx={{ fontSize: 14 }} />
                </StyledBadge>
              ) : (
                <FileIcon sx={{ fontSize: 14 }} />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Definindo filteredColumns para sempre executar hooks depois
  const nonDefaultColumns = ["produto_quantidade_disponivel", "quantidade_atendida", "quantidade_disponivel"];
  let filteredColumns = columns.filter((col) => !nonDefaultColumns.includes(col.field));

  if (updatingRecentProductsQuantity) {
    const selectedColumns = [
      "produto_descricao",
      "quantidade",
      "produto_quantidade_disponivel",
    ];
    filteredColumns = columns.filter((col) =>
      selectedColumns.includes(col.field)
    );
  }
  if (addingReqItems) {
    filteredColumns = columns.filter((col) =>
      ["produto_descricao"].includes(col.field)
    );
  }
  if (attendingItems) {
    filteredColumns = columns.filter((col) =>
      [
        "produto_descricao",
        "quantidade_atendida",
        "quantidade",
        "quantidade_disponivel",
      ].includes(col.field)
    );
  }


  const fetchDinamicColumns = useCallback(async () => {
    try {
      const rawCols = await RequisitionItemService.getDinamicColumns(
        Number(id_requisicao)
      );
      const colsWithRenderCell = rawCols.map((col: GridColDef) => ({
        ...col,
        editable: true,
        renderCell: (params: any) => {
          const { id_item_requisicao } = params.row;
          const quoteItem = params.row.items_cotacao.find(
            (item: QuoteItem) =>
              Number(item.id_cotacao) === Number(params.field)
          );
          const hasquoteItem = quoteItem && !quoteItem.indisponivel;
          const parciallyQuoted = hasquoteItem
            ? Number(quoteItem.quantidade_cotada) <
              Number(quoteItem.quantidade_solicitada)
            : false;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {hasquoteItem &&
                formatCurrency(Number(quoteItem?.preco_unitario) || 0)}
              {hasquoteItem && (
                <Checkbox
                  disabled={blockFields || !editItemFieldsPermitted}
                  onChange={(e) =>
                    handleChangeQuoteItemsSelected(
                      e,
                      Number(quoteItem?.id_item_cotacao),
                      Number(id_item_requisicao)
                    )
                  }
                  checked={
                    quoteItemsSelected.get(Number(id_item_requisicao)) ===
                    Number(quoteItem?.id_item_cotacao)
                      ? true
                      : false
                  }
                  icon={<RadioButtonUncheckedIcon sx={{ fontSize: 14 }} />}
                  checkedIcon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                  sx={{ color: "primary.main" }}
                />
              )}
              {quoteItem?.indisponivel > 0 && (
                <Tooltip
                  title={`Indisponível no fornecedor: ${col.headerName}`}
                >
                  <ErrorIcon color="error" sx={{ fontSize: 14 }} />
                </Tooltip>
              )}
              {parciallyQuoted && (
                <Tooltip
                  title={`Quantidade cotada: ${quoteItem?.quantidade_cotada}`}
                >
                  <ErrorIcon color="secondary" sx={{ fontSize: 14 }} />
                </Tooltip>
              )}
            </Box>
          );
        },
        minWidth: 130,
        sortable: false,
        renderHeader: (params: any) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "110px",
                }}
                fontSize="0.7rem"
                fontWeight="bold"
                color="primary"
              >
                {params.colDef.headerName}
              </Typography>
            </Box>
          );
        },
      }));
      setDinamicColumns(colsWithRenderCell);
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Erro ao buscar colunas dinâmicas",
          type: "error",
        })
      );
    }
  }, [
    dispatch,
    handleChangeQuoteItemsSelected,
    id_requisicao,
    quoteItemsSelected,
  ]);

  const isDinamicField = useCallback(
    (field: string | number): boolean => {
      // Descomente abaixo para ativar a checagem real de colunas dinâmicas
      return dinamicColumns.some((col) => col.field === field);
    },
    [dinamicColumns]
  );

  useEffect(() => {
    if (addingReqItems) return;
    if (updatingRecentProductsQuantity) return;
    fetchDinamicColumns();
  }, [fetchDinamicColumns, addingReqItems, updatingRecentProductsQuantity]);

  return {
    columns:
      dinamicColumns.length > 0
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
