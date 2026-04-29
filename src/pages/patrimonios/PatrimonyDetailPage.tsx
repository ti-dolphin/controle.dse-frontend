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

const PatrimonyDetailPage = () => {

  const navigate = useNavigate()
  const params = useParams();
  const patrimonyNumber = params.id || params.idPatrimonio || params.numero || Object.values(params)[0];
  const [fullScreenChecklist, setFullScreenChecklist] = React.useState(false);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = React.useState(false);
  const [accessoryDialogOpen, setAccessoryDialogOpen] = React.useState(false);

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