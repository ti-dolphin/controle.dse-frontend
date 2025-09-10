import React, { ChangeEvent } from 'react'
import { useParams } from 'react-router-dom';
import { OpportunityAttachment } from '../../models/oportunidades/OpportunityAttachment';
import { useDispatch, useSelector } from 'react-redux';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import OpportunityAttachmentService from '../../services/oportunidades/OpportunityAttachmentService';
import { Box, Button, CircularProgress, IconButton, List, ListItem, ListItemSecondaryAction, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { RootState } from '../../redux/store';
import FirebaseService from '../../services/FireBaseService';
import BaseViewFileDialog from '../shared/BaseVIewFileDialog';
import StyledLink from '../shared/StyledLink';
import LinkIcon from "@mui/icons-material/Link";
import BaseInputDialog from "../shared/BaseInputDialog";

const OpportunityAttachmentList = () => {
  const dispatch = useDispatch();
  const { CODOS } = useParams();
  const user = useSelector((state: RootState) => state.user.user);

  const [attachments, setAttachments] = React.useState<OpportunityAttachment[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [attachmentBeingDeleted, setAttachmentBeingDeleted] =
    React.useState<OpportunityAttachment | null>(null);
  const [selectedFile, setSelectedFile] =
    React.useState<Partial<OpportunityAttachment> | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [linkInput, setLinkInput] = React.useState("");

  //handleDelete

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!user) return;
    const file = e.target.files[0];
    setLoading(true);
    try {
      const newFile: Partial<OpportunityAttachment> = {
        codos: Number(CODOS),
        nome_arquivo: file.name,
        arquivo: "",
      };
      const fileUrl = await FirebaseService.upload(
        file,
        newFile.nome_arquivo || ""
      );
      newFile.arquivo = fileUrl;
      const createdFile = await OpportunityAttachmentService.create(newFile);
      setAttachments((prev) => [...prev, createdFile]);
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

  //fetchData
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const attachments = await OpportunityAttachmentService.getMany(
        Number(CODOS)
      );
      setAttachments(attachments);
    } catch (error) {
      dispatch(
        setFeedback({
          message: "Erro ao buscar anexos",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [CODOS, dispatch]);

  const handleDelete = React.useCallback(async () => {
    if (attachmentBeingDeleted) {
      try {
        const { id_anexo_os } = attachmentBeingDeleted;
        await FirebaseService.delete(attachmentBeingDeleted.arquivo);
        await OpportunityAttachmentService.delete(id_anexo_os);
        setAttachments(
          attachments.filter(
            (attachment) =>
              attachment.id_anexo_os !== attachmentBeingDeleted.id_anexo_os
          )
        );
        dispatch(
          setFeedback({
            message: "Anexo excluído com sucesso",
            type: "success",
          })
        );
        setAttachmentBeingDeleted(null);
      } catch (error) {
        dispatch(
          setFeedback({
            message: "Erro ao excluir anexo",
            type: "error",
          })
        );
      }
    }
  }, [attachmentBeingDeleted, dispatch, fetchData]);

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
    const newLink: Partial<OpportunityAttachment> = {
      codos: Number(CODOS),
      arquivo: linkInput,
      nome_arquivo: linkInput,
    };

    setLoading(true);
    try {
      const createdLink = await OpportunityAttachmentService.create(newLink);
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

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "fit-content",
        flexDirection: "column",
        alignItems: "start",
        gap: 2,
      }}
    >
      <Typography
        variant="subtitle1"
        color="primary.main"
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        Anexos
      </Typography>
      {!loading && (
        <List>
          {attachments.map((attachment) => (
            <ListItem
              divider
              sx={{ maxHeight: 40 }}
              key={attachment.id_anexo_os}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <StyledLink
                  link={attachment.arquivo}
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
                      attachment.arquivo.toLowerCase().includes(ext)
                    );

                    if (isFile) {
                      setSelectedFile(attachment);
                    } else if (
                      attachment.arquivo.startsWith("http://") ||
                      attachment.arquivo.startsWith("https://")
                    ) {
                      window.open(attachment.arquivo, "_blank");
                    }
                  }}
                />
              </Stack>

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => setAttachmentBeingDeleted(attachment)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      <Stack direction="row" alignItems="center" gap={1}>
        <Button
          variant="contained"
          component="label"
          size="small"
          startIcon={<CloudUploadIcon />}
          disabled={loading}
        >
          Adicionar Anexo
          <input type="file" hidden onChange={handleUpload} accept="*" />
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<LinkIcon />}
          disabled={loading}
          onClick={openLinkDialog}
        >
          Adicionar Link
        </Button>
      </Stack>
      <BaseDeleteDialog
        open={Boolean(attachmentBeingDeleted)}
        onConfirm={handleDelete}
        onCancel={() => setAttachmentBeingDeleted(null)}
      />
      <BaseViewFileDialog
        open={selectedFile !== null}
        onClose={() => setSelectedFile(null)}
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

export default OpportunityAttachmentList