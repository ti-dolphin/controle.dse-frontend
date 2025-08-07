import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { PatrimonyService } from '../../services/patrimonios/PatrimonyService';
import { Patrimony } from '../../models/patrimonios/Patrimony';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { Container, Grid, Paper, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, IconButton, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import PatrimonyMovementationTable from '../../components/patrimonios/PatrimonyMovementationTable';
import PatrimonyForm from '../../components/patrimonios/PatrimonyForm';
import ChecklistTable from './ChecklistTable';
import UpperNavigation from '../../components/shared/UpperNavigation';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";

const PatrimonyDetailPage = () => {

  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [patrimony, setPatrimony] = React.useState<Patrimony>();
  const [fullScreenChecklist, setFullScreenChecklist] = React.useState(false);

  const {id_patrimonio} = useParams();


const fetchData = async ( ) => { 
   try{ 
      const data = await PatrimonyService.getById(Number(id_patrimonio));
      setPatrimony(data); 
   }catch(e){
      dispatch(setFeedback({message: 'Houve um erro ao buscar o patrimônio', type: 'error'}));
   }
  }
   const handleBack = () => {
     navigate("/patrimonios");
   };

  //useEffect
  useEffect(() => {
    fetchData();
  }, [dispatch, id_patrimonio])
  return (
    <Box>
      <UpperNavigation handleBack={handleBack} />
      <Grid sx={{ p: 2 }} container spacing={3}>
        {/* Área 1: Detalhes do Patrimônio */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              Patrimônio
            </Typography>
            <PatrimonyForm />
            <Box></Box>
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
    </Box>
  );
}

export default PatrimonyDetailPage