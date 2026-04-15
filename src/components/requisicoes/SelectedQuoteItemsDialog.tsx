import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RootState } from "../../redux/store";
import QuoteService from "../../services/requisicoes/QuoteService";
import { QuoteItemService } from "../../services/requisicoes/QuoteItemService";
import { Quote } from "../../models/requisicoes/Quote";
import { QuoteItem } from "../../models/requisicoes/QuoteItem";
import { formatCurrency2To3 } from "../../utils";
import BaseDataTable from "../shared/BaseDataTable";
import { useSelectedQuoteItemColumns } from "../../hooks/requisicoes/useSelectedQuoteItemColumns";

export interface SelectedQuoteGroup {
  quote: Quote;
  selectedItems: QuoteItem[];
}

interface SelectedQuoteItemsDialogProps {
  open: boolean;
  onClose: () => void;
  idRequisicao: number;
  requisitionTitle?: string;
}

const SelectedQuoteItemsDialog: React.FC<SelectedQuoteItemsDialogProps> = ({
  open,
  onClose,
  idRequisicao,
  requisitionTitle,
}) => {
  const [loading, setLoading] = useState(false);
  const [quoteGroups, setQuoteGroups] = useState<SelectedQuoteGroup[]>([]);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<number[]>([]);

  const theme = useTheme();
  const items = useSelector((state: RootState) => state.requisitionItem.items);
  const columns = useSelectedQuoteItemColumns();

  const exportPdf = useCallback(async (groupsToExport: SelectedQuoteGroup[]) => {
    if (groupsToExport.length === 0) return;

    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      groupsToExport.forEach(({ quote, selectedItems }, groupIndex) => {
        if (groupIndex > 0) {
          doc.addPage();
        }

        const selectedTotal = selectedItems.reduce((acc, item) => {
          const unitPrice = Number(item.preco_unitario || 0);
          const requestedQuantity = Number(item.quantidade_solicitada || 0);
          return acc + unitPrice * requestedQuantity;
        }, 0);

        doc.setFontSize(14);
        doc.setTextColor(25, 118, 210);
        doc.text("Itens Cotados Selecionados", 14, 12);

        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(requisitionTitle || `Requisição ${idRequisicao}`, 14, 18);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Cotação #${quote.id_cotacao}`, 14, 25);
        doc.text(`Fornecedor: ${quote.fornecedor || "-"}`, 14, 30);
        doc.text(`CNPJ: ${quote.cnpj_fornecedor || "-"}`, 14, 35);
        doc.text(
          `Condição de pagamento: ${quote.condicao_pagamento?.nome || "-"}`,
          14,
          40
        );
        doc.text(
          `Frete: ${formatCurrency2To3(Number(quote.valor_frete || 0))}`,
          14,
          45
        );
        doc.text(
          `Total dos itens selecionados: ${formatCurrency2To3(selectedTotal)}`,
          14,
          50
        );

        autoTable(doc, {
          startY: 56,
          head: [
            [
              "Código",
              "Descrição do Produto",
              "Unidade",
              "Qtd. Solicitada",
              "Preço Unitário",
              "ICMS %",
              "IPI %",
              "ST %",
              "Subtotal",
            ],
          ],
          body: selectedItems.map((item) => [
            item.produto_codigo || "-",
            item.produto_descricao || item.descricao_item || "-",
            item.produto_unidade || "-",
            Number(item.quantidade_solicitada || 0).toString(),
            formatCurrency2To3(Number(item.preco_unitario || 0)),
            `${Number(item.ICMS || 0)}%`,
            `${Number(item.IPI || 0)}%`,
            `${Number(item.ST || 0)}%`,
            formatCurrency2To3(
              Number(item.preco_unitario || 0) * Number(item.quantidade_solicitada || 0)
            ),
          ]),
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 1.6,
            valign: "middle",
            overflow: "linebreak",
          },
          headStyles: {
            fillColor: [25, 118, 210],
            textColor: 255,
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: 20, halign: "left" },
            1: { cellWidth: 62 },
            2: { cellWidth: 14, halign: "center" },
            3: { cellWidth: 18, halign: "right" },
            4: { cellWidth: 23, halign: "right" },
            5: { cellWidth: 12, halign: "right" },
            6: { cellWidth: 12, halign: "right" },
            7: { cellWidth: 12, halign: "right" },
            8: { cellWidth: 23, halign: "right" },
          },
          margin: { left: 14, right: 14 },
        });
      });

      doc.save(`itens-cotados-req-${idRequisicao}.pdf`);
    } finally {
      setIsExportingPdf(false);
    }
  }, [idRequisicao]);

  const handleOpenSupplierDialog = useCallback(() => {
    if (quoteGroups.length === 0) return;
    setSelectedQuoteIds(quoteGroups.map(({ quote }) => quote.id_cotacao));
    setSupplierDialogOpen(true);
  }, [quoteGroups]);

  const toggleQuoteSelection = useCallback((quoteId: number, checked: boolean) => {
    setSelectedQuoteIds((prev) => {
      if (checked) {
        return prev.includes(quoteId) ? prev : [...prev, quoteId];
      }
      return prev.filter((id) => id !== quoteId);
    });
  }, []);

  const handleConfirmSupplierSelection = useCallback(async () => {
    const groupsToExport = quoteGroups.filter(({ quote }) =>
      selectedQuoteIds.includes(quote.id_cotacao)
    );

    if (groupsToExport.length === 0) {
      return;
    }

    setSupplierDialogOpen(false);
    await exportPdf(groupsToExport);
  }, [exportPdf, quoteGroups, selectedQuoteIds]);

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
      <Box>
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
                  startIcon={isExportingPdf ? <CircularProgress size={14} /> : <PictureAsPdfIcon />}
                  onClick={handleOpenSupplierDialog}
                  disabled={isExportingPdf || loading}
                >
                  {isExportingPdf ? "Gerando PDF..." : "Baixar PDF"}
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
                        {formatCurrency2To3(Number(quote.valor_frete))}
                      </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total dos itens selecionados
                      </Typography>
                      <Typography fontSize="0.9rem" fontWeight={600} color="success.main">
                        {formatCurrency2To3(
                          selectedItems.reduce(
                            (acc, item) =>
                              acc +
                              Number(item.preco_unitario || 0) *
                                Number(item.quantidade_solicitada || 0),
                            0
                          )
                        )}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 1.5 }} />

                  {/* Items table */}
                  <Box
                    sx={{
                      height: Math.min(60 + selectedItems.length * 52, 400),
                      width: "100%",
                      overflowX: "hidden",
                    }}
                  >
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
                      sx={{
                        height: "100%",
                        width: "100%",
                        "& .MuiDataGrid-virtualScroller": {
                          overflowX: "hidden !important",
                        },
                        "& .MuiDataGrid-main": {
                          overflowX: "hidden",
                        },
                      }}
                    />
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Box>

      <Dialog
        open={supplierDialogOpen}
        onClose={() => setSupplierDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Selecionar fornecedores para o PDF</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={0.5}>
            {quoteGroups.map(({ quote, selectedItems }) => (
              <FormControlLabel
                key={quote.id_cotacao}
                control={
                  <Checkbox
                    checked={selectedQuoteIds.includes(quote.id_cotacao)}
                    onChange={(event) =>
                      toggleQuoteSelection(quote.id_cotacao, event.target.checked)
                    }
                  />
                }
                label={`${quote.fornecedor || "Fornecedor"} | Cotação #${quote.id_cotacao} | ${selectedItems.length} item(ns)`}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSupplierDialogOpen(false)} disabled={isExportingPdf}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmSupplierSelection}
            variant="contained"
            disabled={isExportingPdf || selectedQuoteIds.length === 0}
          >
            Gerar PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default SelectedQuoteItemsDialog;
