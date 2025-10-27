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
import LinkIcon from "@mui/icons-material/Link";
import { RequisitionFile } from "../../models/requisicoes/RequisitionFile";
import RequisitionFileService from "../../services/requisicoes/RequisitionFileService";
import StyledLink from "../shared/StyledLink";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FirebaseService from "../../services/FireBaseService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import BaseViewFileDialog from "../shared/BaseVIewFileDialog";
import BaseInputDialog from "../shared/BaseInputDialog";
import { getDateStringFromISOstring } from "../../utils";

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
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkInput, setLinkInput] = useState("");

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
    console.log(deletingFile , 'oi eu sou um mamel funcionando');
    if (!deletingFile) return;
    const { id } = deletingFile;
    setLoading(true);
    try {
      // Só deleta do Firebase se for arquivo do Firebase Storage
      const isFirebaseFile =
        typeof deletingFile.arquivo === "string" &&
        deletingFile.arquivo.startsWith("https://firebasestorage.googleapis.com/");
      if (isFirebaseFile) {
        await FirebaseService.delete(deletingFile.arquivo);
      }
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

  const openLinkDialog = () => {
    setLinkDialogOpen(true);
  };

  const closeLinkDialog = () => {
    setLinkDialogOpen(false);
    setLinkInput("");
  };

  const handleAddLink = async () => {
    if (!user) return;
    if (!linkInput.trim()) {
      dispatch(
        setFeedback({
          message: "O link não pode estar vazio.",
          type: "error",
        })
      );
      return;
    }
    const newLink: RequisitionFile = {
      id: Math.random(),
      id_requisicao,
      arquivo: linkInput.substring(0, 255),
      nome_arquivo: "",
      criado_por: user.CODPESSOA,
      criado_em: new Date().toISOString(),
    };

    setLoading(true);
    try {
      const createdLink = await RequisitionFileService.create(newLink);
      setAttachments((prev) => [...prev, createdLink]);
      dispatch(
        setFeedback({
          message: "Link adicionado!",
          type: "success",
        })
      );
      closeLinkDialog();
    } catch (err: any) {
      dispatch(
        setFeedback({
          message: `Erro ao adicionar link: ${err.message}`,
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
        <List sx={{ maxHeight: 180, overflow: "auto" }}>
          {attachments.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhum anexo encontrado.
            </Typography>
          )}
          {attachments.map((file) => (
            <ListItem key={file.id} divider sx={{ height: 60 }}>
              <Stack direction="column" alignItems="start" gap={0.2}>
                <StyledLink
                  link={file.arquivo}
                  onClick={() => {
                    const fileExtensions = [
                      ".pdf",
                      ".jpg",
                      ".jpeg",
                      ".png",
                      ".doc",
                      ".docx",
                      ".xls",
                      ".xlsx",
                    ];
                    const isFile = fileExtensions.some((ext) =>
                      file.arquivo.toLowerCase().includes(ext)
                    );

                    if (isFile) {
                      openViewFile(file);
                    } else if (
                      file.arquivo.startsWith("http://") ||
                      file.arquivo.startsWith("https://")
                    ) {
                      window.open(file.arquivo, "_blank");
                    }
                  }}
                />
                <Typography fontSize="12px" color="text.secondary">
                  Por: {file.pessoa_criado_por?.NOME || ""} - {getDateStringFromISOstring(file.criado_em)}
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
      <Stack direction="row" alignItems="center">
        <Button
          startIcon={<CloudUploadIcon sx={{ height: "20px" }} />}
          sx={{ fontSize: "small" }}
          disabled={loading}
          component="label"
        >
          Adicionar Anexo
          <input type="file" hidden onChange={handleFileChange} accept="*" />
        </Button>
        <Button
          variant="contained"
          startIcon={<LinkIcon sx={{ height: "20px", width: "20px" }} />}
          sx={{ fontSize: "small", ml: 1 }}
          disabled={loading}
          onClick={openLinkDialog}
        >
          Adicionar Link
        </Button>
      </Stack>
      <BaseDeleteDialog
        open={deleteDialogOpen}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
      <BaseViewFileDialog
        open={selectedFile !== null}
        onClose={closeViewFile}
        fileUrl={selectedFile?.arquivo || ""}
        title={selectedFile?.nome_arquivo}
      />
      <BaseInputDialog
        open={linkDialogOpen}
        onClose={closeLinkDialog}
        onConfirm={handleAddLink}
        title="Adicionar Link"
        inputLabel="URL do Link"
        inputValue={linkInput}
        onInputChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLinkInput(e.target.value)
        }
      />
    </Box>
  );
};

export default RequisitionAttachmentList;
