import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import QuoteService from "../../services/requisicoes/QuoteService";
import { QuoteItemService } from "../../services/requisicoes/QuoteItemService";
import { Quote } from "../../models/requisicoes/Quote";
import { QuoteItem } from "../../models/requisicoes/QuoteItem";
import { formatCurrency } from "../../utils";
import BaseDataTable from "../shared/BaseDataTable";
import { useSelectedQuoteItemColumns } from "../../hooks/requisicoes/useSelectedQuoteItemColumns";
import { useExportToPdf } from "../../hooks/useExportToPdf";

export interface SelectedQuoteGroup {
  quote: Quote;
  selectedItems: QuoteItem[];
}

interface SelectedQuoteItemsDialogProps {
  open: boolean;
  onClose: () => void;
  idRequisicao: number;
}

const SelectedQuoteItemsDialog: React.FC<SelectedQuoteItemsDialogProps> = ({
  open,
  onClose,
  idRequisicao,
}) => {
  const [loading, setLoading] = useState(false);
  const [quoteGroups, setQuoteGroups] = useState<SelectedQuoteGroup[]>([]);

  const theme = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);
  const { isExporting, exportToPdf } = useExportToPdf();
  const items = useSelector((state: RootState) => state.requisitionItem.items);
  const columns = useSelectedQuoteItemColumns();

  const handleDownloadPdf = () => {
    if (!dialogRef.current) return;
    exportToPdf(dialogRef.current, {
      filename: `itens-cotados-req-${idRequisicao}.pdf`,
      orientation: "landscape",
      selectorsToHide: ["[data-html2pdf-hide]"],
    });
  };

  const fetchSelectedItems = useCallback(async () => {
    if (!idRequisicao) return;

    setLoading(true);
    try {
      const selectedItemCotacaoIds = new Set<number>(
        items
          .filter((item) => item.id_item_cotacao)
          .map((item) => item.id_item_cotacao as number)
      );

      if (selectedItemCotacaoIds.size === 0) {
        setQuoteGroups([]);
        return;
      }

      const quotes: Quote[] = await QuoteService.getAllQuotesByReq(idRequisicao);

      const groups = await Promise.all(
        quotes.map(async (quote) => {
          const allItems: QuoteItem[] = await QuoteItemService.getMany({
            id_cotacao: quote.id_cotacao,
          });
          const selectedItems = allItems.filter((qi) =>
            selectedItemCotacaoIds.has(qi.id_item_cotacao)
          );
          return { quote, selectedItems };
        })
      );

      setQuoteGroups(groups.filter((g) => g.selectedItems.length > 0));
    } finally {
      setLoading(false);
    }
  }, [idRequisicao, items]);

  useEffect(() => {
    if (open) {
      fetchSelectedItems();
    }
  }, [open, fetchSelectedItems]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Box ref={dialogRef}>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" color="primary.main" fontWeight={600}>
              Itens Cotados Selecionados
            </Typography>
            <Stack data-html2pdf-hide direction="row" spacing={1} alignItems="center">
              {quoteGroups.length > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isExporting ? <CircularProgress size={14} /> : <PictureAsPdfIcon />}
                  onClick={handleDownloadPdf}
                  disabled={isExporting || loading}
                >
                  {isExporting ? "Gerando PDF..." : "Baixar PDF"}
                </Button>
              )}
              <IconButton onClick={onClose} color="error" size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : quoteGroups.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
              Nenhum item cotado selecionado foi encontrado para esta requisição.
            </Typography>
          ) : (
            <Stack spacing={2} sx={{ pt: 1 }}>
              {quoteGroups.map(({ quote, selectedItems }) => (
                <Paper key={quote.id_cotacao} variant="outlined" sx={{ p: 2 }}>
                  {/* Quote header */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mb={1.5}
                    flexWrap="wrap"
                    alignItems={{ sm: "center" }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Cotação #{quote.id_cotacao}
                      </Typography>
                      <Typography fontWeight={600} color="primary.main" fontSize="0.95rem">
                        {quote.fornecedor}
                      </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        CNPJ Fornecedor
                      </Typography>
                      <Typography fontSize="0.85rem">{quote.cnpj_fornecedor || "—"}</Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Condição de pagamento
                      </Typography>
                      <Typography fontSize="0.85rem">
                        {quote.condicao_pagamento?.nome || "—"}
                      </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Frete
                      </Typography>
                      <Typography fontSize="0.85rem">
                        {formatCurrency(Number(quote.valor_frete))}
                      </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total dos itens selecionados
                      </Typography>
                      <Typography fontSize="0.9rem" fontWeight={600} color="success.main">
                        {formatCurrency(
                          selectedItems.reduce((acc, item) => acc + Number(item.subtotal), 0)
                        )}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 1.5 }} />

                  {/* Items table */}
                  <Box sx={{ height: Math.min(60 + selectedItems.length * 52, 400) }}>
                    <BaseDataTable
                      rows={selectedItems}
                      columns={columns}
                      getRowId={(row) => row.id_item_cotacao}
                      hideFooter={selectedItems.length < 25}
                      disableRowSelectionOnClick
                      isCellEditable={() => false}
                      theme={theme}
                      density="compact"
                      disableColumnMenu
                      sx={{ height: "100%" }}
                    />
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default SelectedQuoteItemsDialog;
