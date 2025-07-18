import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  CircularProgress,
  Stack,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import StyledLink from "../shared/StyledLink";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FirebaseService from "../../services/FireBaseService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import { QuoteFile } from "../../models/requisicoes/QuoteFile";
import { QuoteFileService } from "../../services/requisicoes/QuoteFileService";
import BaseViewFileDialog from "../shared/BaseVIewFileDialog";

interface QuoteAttachmentListProps {
  id_cotacao: number;
}

const QuoteAttachmentList: React.FC<QuoteAttachmentListProps> = ({
  id_cotacao,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const isSupplierRoute = window.location.pathname.includes(
    "/supplier/requisicoes"
  );
  const [attachments, setAttachments] = useState<QuoteFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFile, setDeletingFile] = useState<QuoteFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<QuoteFile | null>(null);

  const openViewFile = (file: QuoteFile) => {
    setSelectedFile(file);
  };

  const closeViewFile = () => {
    setSelectedFile(null);
  };

  const openDeleteDialog = (file: QuoteFile) => {
    const admin = Number(user?.PERM_ADMINISTRADOR) === 1;
    const purchaser = Number(user?.PERM_COMPRADOR) === 1;
    const deleteFilePermittedForUser = admin || purchaser;

    if (!deleteFilePermittedForUser) {
      dispatch(
        setFeedback({
          message: "Você não tem permissão para excluir este anexo.",
          type: "error",
        })
      );
      return;
    }
    setDeletingFile(file);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeletingFile(null);
    setDeleteDialogOpen(false);
  };

  const fetchAttachments = async () => {
    setLoading(true);
    try {
      const files = await QuoteFileService.getMany({ id_cotacao });
      setAttachments(files);
    } catch (err: any) {
      setError("Erro ao buscar anexos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
    // eslint-disable-next-line
  }, [id_cotacao]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!user) return;
    const file = e.target.files[0];
    const newFile: Partial<QuoteFile> = {
      id_cotacao,
      nome_arquivo: file.name,
      url: "",
    };
    setLoading(true);
    try {
      const fileUrl = await FirebaseService.upload(file, newFile.nome_arquivo || '');
      newFile.url = fileUrl;
      const createdFile = await QuoteFileService.create(newFile);
      setAttachments((prev) => [...prev, createdFile]);
      fetchAttachments();
      dispatch(
        setFeedback({
          message: "Anexo adicionado!",
          type: "success",
        })
      );
    } catch (err: any) {
      dispatch(
        setFeedback({
          message: `Houve um erro ao adicionar o anexo: ${err.message}`,
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingFile) return;
    const { id_anexo_cotacao } = deletingFile;
    setLoading(true);
    try {
      await FirebaseService.delete(deletingFile.url);
      await QuoteFileService.delete(id_anexo_cotacao);
      setAttachments((prev) =>
        prev.filter((a) => a.id_anexo_cotacao !== id_anexo_cotacao)
      );
      dispatch(
        setFeedback({
          message: "Anexo excluído!",
          type: "success",
        })
      );
      closeDeleteDialog();
    } catch (err: any) {
      dispatch(
        setFeedback({
          message: `Erro ao excluir anexo: ${err.message}`,
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Typography color="error" mb={1}>
          {error}
        </Typography>
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <List sx={{ maxHeight: 120, overflow: "auto" }}>
          {attachments.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhum anexo encontrado.
            </Typography>
          )}
          {attachments.map((file) => (
            <ListItem
              key={file.id_anexo_cotacao}
              divider
              sx={{ maxHeight: 40 }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <StyledLink
                  link={file.url}
                  onClick={() => openViewFile(file)}
                />
                <Typography fontSize="12px" color="text.secondary">
                  {/* Por: {file.pessoa_criado_por?.NOME || ""} */}
                </Typography>
              </Stack>

              <ListItemSecondaryAction>
                <Tooltip title="Excluir">
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => openDeleteDialog(file)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        disabled={loading}
      >
        Adicionar Anexo
        <input type="file" hidden onChange={handleFileChange} accept="*" />
      </Button>
      <BaseDeleteDialog
        open={deleteDialogOpen}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
      <BaseViewFileDialog
        open={selectedFile !== null}
        onClose={closeViewFile}
        fileUrl={selectedFile?.url || ""}
        title={selectedFile?.nome_arquivo}
      />
    </Box>
  );
};

export default QuoteAttachmentList;
