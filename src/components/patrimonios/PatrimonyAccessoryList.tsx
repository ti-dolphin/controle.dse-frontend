import React, { ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
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
  TextField,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { PatrimonyAccessoryService } from '../../services/patrimonios/PatrimonyAccessoryService';
import AccessoryAttachmentService from '../../services/AccessoryAttachmentService';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import AccessoryAttachmentDialog from './AccessoryAttachmentDialog';

interface PatrimonyAccessoryListProps {
  open: boolean
  onClose: () => void
}

interface PatrimonyAccessory {
  id_acessorio_patrimonio: number;
  nome: string;
  id_patrimonio: number;
  descricao?: string
}

const PatrimonyAccessoryList: React.FC<PatrimonyAccessoryListProps> = ({
  open,
  onClose
}) => {
  const dispatch = useDispatch()
  const { id_patrimonio } = useParams()

  const [accessories, setAccessories] = React.useState<PatrimonyAccessory[]>([])
  const [loading, setLoading] = React.useState(false)
  const [accessoryBeingDeleted, setAccessoryBeingDeleted] = React.useState<PatrimonyAccessory | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [attachmentDialogOpen, setAttachmentDialogOpen] = React.useState(false)
  const [selectedAccessory, setSelectedAccessory] = React.useState<PatrimonyAccessory | null>(null)
  const [formData, setFormData] = React.useState({ nome: '', descricao: '' })

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await PatrimonyAccessoryService.getManyById(Number(id_patrimonio))
      setAccessories(data)
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: 'Erro ao buscar acessórios',
          type: 'error',
        })
      )
    } finally {
      setLoading(false)
    }
  }, [id_patrimonio, dispatch])

  const handleDelete = React.useCallback(async () => {
    if (accessoryBeingDeleted) {
      try {
        await PatrimonyAccessoryService.delete(accessoryBeingDeleted.id_acessorio_patrimonio)
        setAccessories(
          accessories.filter(
            (acc) => acc.id_acessorio_patrimonio !== accessoryBeingDeleted.id_acessorio_patrimonio
          )
        )
        dispatch(
          setFeedback({
            message: 'Acessório excluído com sucesso',
            type: 'success',
          })
        )
        setAccessoryBeingDeleted(null)
      } catch (error: any) {
        dispatch(
          setFeedback({
            message: 'Erro ao excluir acessório',
            type: 'error',
          })
        )
      }
    }
  }, [accessoryBeingDeleted, accessories, dispatch])

  const handleCreate = async () => {
    if (!formData.nome.trim()) {
      dispatch(
        setFeedback({
          message: 'O nome do acessório é obrigatório',
          type: 'error',
        })
      )
      return
    }

    setLoading(true)
    try {
      const created = await PatrimonyAccessoryService.create({
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        id_patrimonio: Number(id_patrimonio)
      })

      setAccessories((prev) => [...prev, created])
      dispatch(
        setFeedback({
          message: 'Acessório criado com sucesso',
          type: 'success',
        })
      )
      setFormData({ nome: '', descricao: '' })
      setCreateDialogOpen(false)
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: `Erro ao criar acessório: ${error.message}`,
          type: 'error',
        })
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAttachmentDialog = (accessory: PatrimonyAccessory) => {
    setSelectedAccessory(accessory)
    setAttachmentDialogOpen(true)
  }

  React.useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open, fetchData])

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
              Acessórios do Patrimônio
            </Typography>
            <Stack direction="row" gap={1}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Novo
              </Button>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
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
            {!loading && accessories.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 4 }}
              >
                Nenhum acessório adicionado ainda.
              </Typography>
            )}

            {!loading && accessories.length > 0 && (
              <List sx={{ width: '100%' }}>
                {accessories.map((accessory) => (
                  <Paper
                    key={accessory.id_acessorio_patrimonio}
                    sx={{ mb: 1, p: 2 }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {accessory.nome}
                        </Typography>
                        {accessory.descricao && (
                          <Typography variant="body2" color="text.secondary">
                            {accessory.descricao}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" gap={1}>
                        <Button
                          size="small"
                          startIcon={<AttachFileIcon />}
                          variant="outlined"
                          onClick={() => handleOpenAttachmentDialog(accessory)}
                        >
                          Anexos
                        </Button>
                        <IconButton
                          edge="end"
                          color="error"
                          size="small"
                          onClick={() => setAccessoryBeingDeleted(accessory)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
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
      </Dialog>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Acessório</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            fullWidth
          />
          <TextField
            label="Descrição"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreate} variant="contained" disabled={loading}>
            Criar
          </Button>
        </DialogActions>
      </Dialog>

      <BaseDeleteDialog
        open={!!accessoryBeingDeleted}
        onCancel={() => setAccessoryBeingDeleted(null)}
        onConfirm={handleDelete}
        title="Deletar Acessório"
        message={`Tem certeza que deseja deletar o acessório "${accessoryBeingDeleted?.nome}"?`}
      />

      {selectedAccessory && (
        <AccessoryAttachmentDialog
          open={attachmentDialogOpen}
          onClose={() => {
            setAttachmentDialogOpen(false)
            setSelectedAccessory(null)
          }}
          accessory={selectedAccessory}
        />
      )}
    </>
  )
}

export default PatrimonyAccessoryList