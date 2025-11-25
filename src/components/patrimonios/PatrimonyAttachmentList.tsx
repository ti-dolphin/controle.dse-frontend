import React, { ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Stack,
  Typography,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { RootState } from '../../redux/store';
import FirebaseService from '../../services/FireBaseService';
import PatrimonyAttachmentService, { PatrimonyAttachment } from '../../services/PatrimonyAttachmentService';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import BaseViewFileDialog from '../shared/BaseVIewFileDialog';
import BaseInputDialog from '../shared/BaseInputDialog';
import StyledLink from '../shared/StyledLink';
import { getDateStringFromISOstring } from '../../utils';

interface PatrimonyAttachmentListProps {
  open: boolean;
  onClose: () => void;
}

const PatrimonyAttachmentList: React.FC<PatrimonyAttachmentListProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { id_patrimonio } = useParams();
  const user = useSelector((state: RootState) => state.user.user);

  const [attachments, setAttachments] = React.useState<PatrimonyAttachment[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);
  const [attachmentBeingDeleted, setAttachmentBeingDeleted] =
    React.useState<PatrimonyAttachment | null>(null);
  const [selectedFile, setSelectedFile] =
    React.useState<Partial<PatrimonyAttachment> | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [linkInput, setLinkInput] = React.useState('');

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setLoading(true);
    try {
      const fileUrl = await FirebaseService.upload(file, file.name);
      
      const payload = {
        id_patrimonio: Number(id_patrimonio),
        nome_arquivo: file.name,
        arquivo: fileUrl,
      };
      
      const createdFile = await PatrimonyAttachmentService.create(payload);
      
      setAttachments((prev) => [...prev, createdFile]);
      dispatch(
        setFeedback({
          message: 'Anexo adicionado!',
          type: 'success',
        })
      );
    } catch (err: any) {
      dispatch(
        setFeedback({
          message: `Houve um erro ao adicionar o anexo: ${err.message}`,
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const attachments = await PatrimonyAttachmentService.getMany(Number(id_patrimonio));
      setAttachments(attachments);
    } catch (error) {
      dispatch(
        setFeedback({
          message: 'Erro ao buscar anexos',
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  }, [id_patrimonio, dispatch]);

  const handleDelete = React.useCallback(async () => {
    if (attachmentBeingDeleted) {
      try {
        const { id_anexo_patrimonio } = attachmentBeingDeleted;
        await FirebaseService.delete(attachmentBeingDeleted.arquivo);
        await PatrimonyAttachmentService.delete(id_anexo_patrimonio);
        
        setAttachments(
          attachments.filter(
            (attachment) =>
              attachment.id_anexo_patrimonio !== id_anexo_patrimonio
          )
        );
        dispatch(
          setFeedback({
            message: 'Anexo excluído com sucesso',
            type: 'success',
          })
        );
        setAttachmentBeingDeleted(null);
      } catch (error) {
        dispatch(
          setFeedback({
            message: 'Erro ao excluir anexo',
            type: 'error',
          })
        );
      }
    }
  }, [attachmentBeingDeleted, attachments, dispatch]);

  const openLinkDialog = () => {
    setLinkDialogOpen(true);
  };

  const closeLinkDialog = () => {
    setLinkDialogOpen(false);
    setLinkInput('');
  };

  const handleAddLink = async () => {
    if (!linkInput.trim()) {
      dispatch(
        setFeedback({
          message: 'O link não pode estar vazio.',
          type: 'error',
        })
      );
      return;
    }

    const payload = {
      id_patrimonio: Number(id_patrimonio),
      arquivo: linkInput,
      nome_arquivo: linkInput,
    };

    setLoading(true);
    try {
      const createdLink = await PatrimonyAttachmentService.create(payload);
      
      setAttachments((prev) => [...prev, createdLink]);
      dispatch(
        setFeedback({
          message: 'Link adicionado!',
          type: 'success',
        })
      );
      closeLinkDialog();
    } catch (err: any) {
      dispatch(
        setFeedback({
          message: `Erro ao adicionar link: ${err.message}`,
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const fileExtensions = [
    '.pdf',
    '.jpg',
    '.jpeg',
    '.png',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
  ];

  const handleAttachmentClick = (attachment: PatrimonyAttachment) => {
    const isFile = fileExtensions.some((ext) =>
      attachment.arquivo.toLowerCase().includes(ext)
    );

    if (isFile) {
      setSelectedFile(attachment);
    } else if (
      attachment.arquivo.startsWith('http://') ||
      attachment.arquivo.startsWith('https://')
    ) {
      window.open(attachment.arquivo, '_blank');
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" color="primary.main">
              Anexos do Patrimônio
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minHeight: 300,
            }}
          >
            {!loading && attachments.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 4 }}
              >
                Nenhum anexo adicionado ainda.
              </Typography>
            )}
            
            {!loading && attachments.length > 0 && (
              <List sx={{ width: '100%' }}>
                {attachments.map((attachment) => (
                  <ListItem
                    divider
                    sx={{ maxHeight: 60 }}
                    key={attachment.id_anexo_patrimonio}
                  >
                    <Stack sx={{ width: '100%' }}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <StyledLink
                          link={attachment.arquivo}
                          onClick={() => handleAttachmentClick(attachment)}
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
                    </Stack>
                  </ListItem>
                ))}
              </List>
            )}
            
            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 4,
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" alignItems="center" gap={1} sx={{ width: '100%', justifyContent: 'flex-end', px: 2, py: 1 }}>
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
        </DialogActions>
      </Dialog>

      <BaseDeleteDialog
        open={Boolean(attachmentBeingDeleted)}
        onConfirm={handleDelete}
        onCancel={() => setAttachmentBeingDeleted(null)}
      />
      
      <BaseViewFileDialog
        open={selectedFile !== null}
        onClose={() => setSelectedFile(null)}
        fileUrl={selectedFile?.arquivo || ''}
        title={selectedFile?.nome_arquivo || ''}
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
    </>
  );
};

export default PatrimonyAttachmentList;
