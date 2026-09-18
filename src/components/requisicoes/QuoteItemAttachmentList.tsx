import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuoteItemAttachment } from "../../models/requisicoes/QuoteItemAttachment";
import FirebaseService from "../../services/FireBaseService";
import { QuoteItemAttachmentService } from "../../services/requisicoes/QuoteItemAttachmentService";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import BaseInputDialog from "../shared/BaseInputDialog";
import BaseViewFileDialog from "../shared/BaseVIewFileDialog";
import StyledLink from "../shared/StyledLink";

interface QuoteItemAttachmentListProps {
  id_item_cotacao: number;
  onAttachmentsChange?: (attachments: QuoteItemAttachment[]) => void;
}

const QuoteItemAttachmentList = ({
  id_item_cotacao,
  onAttachmentsChange,
}: QuoteItemAttachmentListProps) => {
  const { token } = useParams();
  const [attachments, setAttachments] = useState<QuoteItemAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<QuoteItemAttachment | null>(null);
  const [selectedFile, setSelectedFile] = useState<QuoteItemAttachment | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkInput, setLinkInput] = useState("");

  const updateAttachments = (next: QuoteItemAttachment[]) => {
    setAttachments(next);
    onAttachmentsChange?.(next);
  };

  const fetchAttachments = async () => {
    setLoading(true);
    setError(null);
    try {
      const files = await QuoteItemAttachmentService.getByQuoteItem(
        id_item_cotacao,
        1,
        token,
      );
      updateAttachments(files);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao buscar anexos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [id_item_cotacao, token]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const arquivo = await FirebaseService.upload(file, file.name);
      const createdFile = await QuoteItemAttachmentService.create(
        {
          id_item_cotacao,
          arquivo,
          nome_arquivo: file.name,
          tipo: 1,
        },
        token,
      );
      updateAttachments([...attachments, createdFile]);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Erro ao adicionar anexo.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deletingFile) return;

    setLoading(true);
    setError(null);
    try {
      await QuoteItemAttachmentService.delete(
        deletingFile.id_anexo_item_cotacao,
        token,
      );

      if (deletingFile.arquivo.startsWith("https://firebasestorage.googleapis.com/")) {
        try {
          await FirebaseService.delete(deletingFile.arquivo);
        } catch (_) {}
      }

      updateAttachments(
        attachments.filter(
          (file) =>
            file.id_anexo_item_cotacao !== deletingFile.id_anexo_item_cotacao,
        ),
      );
      setDeletingFile(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao remover anexo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async () => {
    const link = linkInput.trim();
    if (!link) return;

    setLoading(true);
    setError(null);
    try {
      const createdFile = await QuoteItemAttachmentService.create(
        {
          id_item_cotacao,
          arquivo: link,
          nome_arquivo: "",
          tipo: 1,
        },
        token,
      );
      updateAttachments([...attachments, createdFile]);
      setLinkDialogOpen(false);
      setLinkInput("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao adicionar link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? (
        <CircularProgress />
      ) : (
        <List sx={{ maxHeight: 300, overflow: "auto" }}>
          {attachments.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhum anexo encontrado.
            </Typography>
          )}
          {attachments.map((file) => (
            <ListItem
              key={file.id_anexo_item_cotacao}
              divider
              sx={{ minHeight: 72, pr: 6 }}
            >
              <Stack sx={{ minWidth: 0 }}>
                <StyledLink
                  link={file.arquivo}
                  onClick={() => {
                    const isFile = [
                      ".pdf",
                      ".jpg",
                      ".jpeg",
                      ".png",
                      ".doc",
                      ".docx",
                      ".xls",
                      ".xlsx",
                    ].some((extension) =>
                      file.arquivo.toLowerCase().includes(extension),
                    );
                    if (isFile) {
                      setSelectedFile(file);
                    } else {
                      window.open(file.arquivo, "_blank");
                    }
                  }}
                />
                {file.nome_arquivo && (
                  <Typography fontSize="11px" color="text.secondary">
                    {file.nome_arquivo}
                  </Typography>
                )}
              </Stack>
              <ListItemSecondaryAction>
                <Tooltip title="Excluir">
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => setDeletingFile(file)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} gap={0.5} alignItems="start">
        <Button
          component="label"
          disabled={loading}
          startIcon={<CloudUploadIcon />}
        >
          Adicionar anexo
          <input type="file" hidden accept="*" onChange={handleFileChange} />
        </Button>
        <Button
          variant="contained"
          disabled={loading}
          startIcon={<LinkIcon />}
          onClick={() => setLinkDialogOpen(true)}
        >
          Adicionar link
        </Button>
      </Stack>

      <BaseDeleteDialog
        open={deletingFile !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeletingFile(null)}
      />
      <BaseViewFileDialog
        open={selectedFile !== null}
        onClose={() => setSelectedFile(null)}
        fileUrl={selectedFile?.arquivo || ""}
        title="Visualizar anexo"
      />
      <BaseInputDialog
        open={linkDialogOpen}
        onClose={() => {
          setLinkDialogOpen(false);
          setLinkInput("");
        }}
        onConfirm={handleAddLink}
        title="Adicionar link"
        inputLabel="URL do link"
        inputValue={linkInput}
        onInputChange={(event: ChangeEvent<HTMLInputElement>) =>
          setLinkInput(event.target.value)
        }
      />
    </Box>
  );
};

export default QuoteItemAttachmentList;
