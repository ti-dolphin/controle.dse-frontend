import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box, Stack, IconButton, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import PatrimonyMovementationTable from '../../components/patrimonios/PatrimonyMovementationTable';
import PatrimonyForm from '../../components/patrimonios/PatrimonyForm';
import ChecklistTable from './ChecklistTable';
import UpperNavigation from '../../components/shared/UpperNavigation';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PatrimonyAttachmentList from '../../components/patrimonios/PatrimonyAttachmentList';

const PatrimonyDetailPage = () => {

  const navigate = useNavigate()
  const [fullScreenChecklist, setFullScreenChecklist] = React.useState(false);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = React.useState(false);

   const handleBack = () => {
     navigate("/patrimonios");
   };

  return (
    <Box>
      <UpperNavigation handleBack={handleBack} />
      <Grid sx={{ p: 2 }} container spacing={3}>
        {/* Área 1: Detalhes do Patrimônio */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary.main">
                Patrimônio
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                size="small"
                onClick={() => setAttachmentDialogOpen(true)}
              >
                Anexo
              </Button>
            </Stack>
            <PatrimonyForm />
          </Paper>
        </Grid>

        {/* Área 2: Tabela de Movimentações */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 1, }}>
            <PatrimonyMovementationTable />
          </Paper>
        </Grid>

        {/* Área 3: Tabela de Checklists */}
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

      {/* Modal de Checklists */}
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

      {/* Modal de Anexos */}
      <PatrimonyAttachmentList
        open={attachmentDialogOpen}
        onClose={() => setAttachmentDialogOpen(false)}
      />
    </Box>
  );
}

export default PatrimonyDetailPage