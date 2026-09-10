import {
  Badge,
  BadgeProps,
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ChangeEvent, useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { calculateQuoteSubtotal, formatDecimalPtBr2To3, formatQuantidade } from "../../utils";
import FileIcon from '@mui/icons-material/FilePresent';
import { QuoteItemAttachment } from "../../models/requisicoes/QuoteItemAttachment";
import QuoteItemAttachmentList from "../../components/requisicoes/QuoteItemAttachmentList";

export const useQuoteItemColumns = (
  handleUpdateUnavailable: (params: ChangeEvent<HTMLInputElement>, itemId : number) => void,
  blockFields: boolean,
  onViewAttachments?: (id_item_requisicao: number) => void,
  onQuoteItemAttachmentsChange?: (
    id_item_cotacao: number,
    attachments: QuoteItemAttachment[],
  ) => void,
)  => {

  const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      padding: "0 4px",
    },
  }));

  const [dialogQuoteItemAttachmentOpen, setDialogquoteItemAttachmentOpen] = useState(false)
  const [quoteItemAttachmentSelectedId, setQuoteItemAttachmentSelectedId] = useState<number | null>(null)

  const openDialogQuoteItemAttachment = (id: number | string) => {
    setQuoteItemAttachmentSelectedId(Number(id));
    setDialogquoteItemAttachmentOpen(true);
  }

  const closeDialogQuoteItemAttachment = () => {
    setDialogquoteItemAttachmentOpen(false);
    setQuoteItemAttachmentSelectedId(null);
  }

  const columns: GridColDef[] = [
    {
      field: 'ordem',
      headerName: 'N°',
      width: 60,
      type: "number",
      renderCell: (params: any) => (
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1        
      )
    },
    {
      field: "anexos",
      headerName: "Anexos",
      flex: 0.4,
      sortable: false,
      editable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <IconButton
            size="small"
            onClick={() => onViewAttachments?.(params.row.id_item_requisicao)}
            title="Ver anexos do item"
          >
            <AttachFileIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "produto_descricao",
      headerName: "Descrição do Produto",
      flex: 3.5,
      editable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "observacao",
      headerName: "Observação",
      flex: 1,
      editable: true,
      valueGetter: (observacao: string) => observacao || "N/A",
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            height: "100%",
          }}
        >
          <Tooltip title="Copiar observação">
            <IconButton
              onClick={() => navigator.clipboard.writeText(String(params.value || ""))}
              sx={{ padding: 0, flexShrink: 0 }}
            >
              <ContentCopyIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          <Typography fontSize="small" fontWeight="bold">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "produto_unidade",
      headerName: "Unidade",
      flex: 0.5,
      editable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="12px" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "preco_unitario",
      headerName: "Preço Unitário",
      flex: 0.6,
      editable: true,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value != null
              ? formatDecimalPtBr2To3(Number(params.value))
              : ""}
          </Typography>
        </Box>
      ),
    },
    {
      field: "quantidade_solicitada",
      headerName: "Qtde. Solicitada",
      type: "number",
      flex: 0.7,
      editable: false,
      renderCell: (params: any) => formatQuantidade(params.value),
    },
    {
      field: "quantidade_cotada",
      headerName: "Qtde. Cotada",
      type: "number",
      flex: 0.7,
      editable: true,
      renderCell: (params: any) => formatQuantidade(params.value),
    },
    {
      field: "ICMS",
      headerName: "ICMS (%)",
      type: "number",
      flex: 0.5,
      editable: true,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value != null
              ? formatDecimalPtBr2To3(Number(params.value))
              : ""}
          </Typography>
        </Box>
      ),
    },
    {
      field: "IPI",
      headerName: "IPI (%)",
      type: "number",
      flex: 0.5,
      editable: true,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value != null
              ? formatDecimalPtBr2To3(Number(params.value))
              : ""}
          </Typography>
        </Box>
      ),
    },
    {
      field: "ST",
      headerName: "ST (%)",
      type: "number",
      flex: 0.5,
      editable: true,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value != null
              ? formatDecimalPtBr2To3(Number(params.value))
              : ""}
          </Typography>
        </Box>
      ),
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      flex: 0.5,
      editable: false,
      renderCell: (params: any) => {
        const precoUnitario = Number(params.row?.preco_unitario || 0);
        const quantidadeCotada = Number(params.row?.quantidade_cotada || 0);
        const ipi = Number(params.row?.IPI || 0);
        const st = Number(params.row?.ST || 0);

        const calculatedSubtotal = calculateQuoteSubtotal(
          precoUnitario,
          quantidadeCotada,
          ipi,
          st
        );

        const subtotalToDisplay =
          quantidadeCotada > 0 && Number.isFinite(calculatedSubtotal)
            ? calculatedSubtotal
            : Number(params.value || 0);

        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography fontSize="small" fontWeight="bold" color="black">
              {formatDecimalPtBr2To3(subtotalToDisplay)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      type: 'actions',
      minWidth: 140,
      renderCell: (row) => {
        const { id } = row
        const anexos = row.row.anexos ?? []
        const normalAttachmentsCount = anexos.filter(
          (anexo: any) => (anexo.tipo ?? 1) !== 2
        ).length;

        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: .4
            }}
          >
              <Tooltip title="Anexos">
                <IconButton
                  onClick={() => openDialogQuoteItemAttachment(id)}
                  sx={{ height: 24, width: 24 }}
                >
                  {normalAttachmentsCount > 0 ? (
                    <StyledBadge
                      variant="standard"
                      badgeContent={normalAttachmentsCount}
                      color="primary"
                    >
                      <FileIcon sx={{ fontSize: 14 }} />
                    </StyledBadge>
                  ) : (
                    <FileIcon sx={{ fontSize: 14 }} />
                  )}
                </IconButton>
              </Tooltip>
          </Box>
        )
      }
    },
    {
      field: "indisponivel",
      headerName: "Indisponivel",
      flex: 0.5,
      editable: false,
      renderCell: (params: any) => { 
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              disabled={blockFields}
              checked={Number(params.value) === 1 ? true : false}
              onChange={(changeParams) =>
                handleUpdateUnavailable(changeParams, Number(params.id))
              }
              inputProps={{ "aria-label": "Indisponível" }}
            />
          </Box>
        );
      },
    },
  ];

  const quoteItemAttachmentDialog = (
    <Dialog
      open={
        dialogQuoteItemAttachmentOpen && quoteItemAttachmentSelectedId !== null
      }
      onClose={closeDialogQuoteItemAttachment}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Anexos do item da cotação</DialogTitle>
      <IconButton
        onClick={closeDialogQuoteItemAttachment}
        color="error"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {quoteItemAttachmentSelectedId !== null && (
          <QuoteItemAttachmentList
            id_item_cotacao={quoteItemAttachmentSelectedId}
            onAttachmentsChange={(attachments) =>
              onQuoteItemAttachmentsChange?.(
                quoteItemAttachmentSelectedId,
                attachments,
              )
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );

  return { columns, quoteItemAttachmentDialog };
};
