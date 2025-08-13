import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Button,
  CircularProgress,
  Stack,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { RequisitionFile } from "../../models/requisicoes/RequisitionFile";
import RequisitionFileService from "../../services/requisicoes/RequisitionFileService";
import StyledLink from "../shared/StyledLink";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FirebaseService from "../../services/FireBaseService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import BaseViewFileDialog from "../shared/BaseVIewFileDialog";

interface RequisitionAttachmentListProps {
  id_requisicao: number;
}

const RequisitionAttachmentList: React.FC<RequisitionAttachmentListProps> = ({
  id_requisicao,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [attachments, setAttachments] = useState<RequisitionFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFile, setDeletingFile] = useState<RequisitionFile | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<RequisitionFile | null>(
    null
  );

  const openViewFile = (file: RequisitionFile) => {
    setSelectedFile(file);
  };

  const closeViewFile = () => {
    setSelectedFile(null);
  };

  const openDeleteDialog = (file: RequisitionFile) => {
    const admin = Number(user?.PERM_ADMINISTRADOR) === 1;
    const allowedToDelete = Number(user?.CODPESSOA) === Number(file.criado_por);
    const deleteFilePermittedForUser = admin || allowedToDelete;

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
      const files = await RequisitionFileService.getMany({ id_requisicao });
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
  }, [id_requisicao]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!user) return;
    const file = e.target.files[0];
    const newFile: RequisitionFile = {
      id: Math.random(),
      id_requisicao,
      arquivo: "",
      nome_arquivo: file.name,
      criado_por: user.CODPESSOA,
      criado_em: "",
    };
    setLoading(true);
    try {
      const fileUrl = await FirebaseService.upload(file, newFile.nome_arquivo);
      newFile.arquivo = fileUrl;
      const createdFile = await RequisitionFileService.create(newFile);
      setAttachments((prev) => [...prev, createdFile]);
      newFile.arquivo = fileUrl;
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
    const { id } = deletingFile;
    setLoading(true);
    try {
      await FirebaseService.delete(deletingFile.arquivo);
      await RequisitionFileService.delete(id);
      setAttachments((prev) => prev.filter((a) => a.id !== id));
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
            <ListItem key={file.id} divider sx={{ height: 30 }}>
              <Stack direction="column" alignItems="start" gap={0.2}>
                <StyledLink
                  link={file.arquivo}
                  onClick={() => openViewFile(file)}
                />
                {/* <Typography fontSize="12px" color="text.secondary">
                  Por: {file.pessoa_criado_por?.NOME || ""}
                </Typography> */}
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

        startIcon={<CloudUploadIcon sx={{height: '20px', width: '20px'}}/>}
        sx={{fontSize: 'small'}}
        disabled={loading}
        component="label"
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
        fileUrl={selectedFile?.arquivo || ''}
        title={selectedFile?.nome_arquivo}
      />
    </Box>
  );
};

export default RequisitionAttachmentList;
