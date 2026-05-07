import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Paper, Typography, Box, Stack, IconButton, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import PatrimonyMovementationTable from '../../components/patrimonios/PatrimonyMovementationTable';
import PatrimonyForm from '../../components/patrimonios/PatrimonyForm';
import ChecklistTable from './ChecklistTable';
import UpperNavigation from '../../components/shared/UpperNavigation';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PatrimonyAttachmentList from '../../components/patrimonios/PatrimonyAttachmentList';
import PatrimonyAccessoryList from '../../components/patrimonios/PatrimonyAccessoryList';
import { useDispatch, useSelector } from 'react-redux';
import { PatrimonyService } from '../../services/patrimonios/PatrimonyService';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { Patrimony } from '../../models/patrimonios/Patrimony';
import { usePatrimonyFormPermissions } from '../../hooks/patrimonios/usePatrimonyFormPermissions';
import { RootState } from '../../redux/store';

const PatrimonyDetailPage = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const params = useParams();
  const patrimonyNumber = params.id || params.idPatrimonio || params.numero || Object.values(params)[0];
  const [fullScreenChecklist, setFullScreenChecklist] = React.useState(false);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = React.useState(false);
  const [accessoryDialogOpen, setAccessoryDialogOpen] = React.useState(false);
  const [patrimony, setPatrimony] = React.useState<Patrimony | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const { permissionToEdit } = usePatrimonyFormPermissions("edit", patrimony || undefined);
  const canToggleActive = Number(user?.PERM_ADMINISTRADOR) === 1 || Number(user?.PERM_ESTOQUE) === 1;

  const fetchPatrimony = React.useCallback(async () => {
    const parsedId = Number(patrimonyNumber);
    if (!parsedId || Number.isNaN(parsedId)) return;
    try {
      const data = await PatrimonyService.getById(parsedId);
      setPatrimony(data);
    } catch (error) {
      dispatch(
        setFeedback({
          message: "Houve um erro ao buscar o patrimônio",
          type: "error",
        })
      );
    }
  }, [dispatch, patrimonyNumber]);

  const handleToggleActive = async () => {
    if (!patrimony || isUpdatingStatus) return;
    const nextValue = patrimony.ativo === 1 ? 0 : 1;
    setIsUpdatingStatus(true);
    try {
      const updated = await PatrimonyService.update(patrimony.id_patrimonio, {
        ativo: nextValue,
      });
      setPatrimony(updated);
      dispatch(
        setFeedback({
          message: nextValue === 1 ? "Patrimônio ativado" : "Patrimônio desativado",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        setFeedback({
          message: "Houve um erro ao atualizar o patrimônio",
          type: "error",
        })
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  React.useEffect(() => {
    fetchPatrimony();
  }, [fetchPatrimony]);

  const handleBack = () => {
    navigate("/patrimonios");
  };

  return (
    <Box>
      <UpperNavigation handleBack={handleBack} />
      <Grid sx={{ p: 2 }} container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary.main">
                Patrimônio #{patrimonyNumber}
              </Typography>
              {canToggleActive && (
                <Button
                  variant="contained"
                  size="small"
                  color={patrimony?.ativo === 1 ? "error" : "primary"}
                  disabled={!permissionToEdit || isUpdatingStatus || !patrimony}
                  onClick={handleToggleActive}
                >
                  {patrimony?.ativo === 1 ? "Desativar" : "Ativar"}
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                size="small"
                onClick={() => setAttachmentDialogOpen(true)}
              >
                Anexo
              </Button>
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                size="small"
                onClick={() => setAccessoryDialogOpen(true)}
              >
                Acessórios
              </Button>

            </Stack>
            <PatrimonyForm />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 1, }}>
            <PatrimonyMovementationTable />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Checklists
              </Typography>
              <IconButton onClick={() => setFullScreenChecklist(true)}>
                <FullscreenIcon />
              </IconButton>
            </Stack>
            <ChecklistTable />
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        fullScreen
        open={fullScreenChecklist}
        onClose={() => setFullScreenChecklist(false)}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              Checklists
            </Typography>
            <Button
              onClick={() => setFullScreenChecklist(false)}
              variant="contained"
              color="error"
            >
              Fechar
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <ChecklistTable />
        </DialogContent>
      </Dialog>

      <PatrimonyAttachmentList
        open={attachmentDialogOpen}
        onClose={() => setAttachmentDialogOpen(false)}
      />

      <PatrimonyAccessoryList
        open={accessoryDialogOpen}
        onClose={() => setAccessoryDialogOpen(false)}
      />

    </Box>
  );
}

export default PatrimonyDetailPage