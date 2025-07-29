
import { Box, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import { ProjectService } from '../../services/ProjectService';
import { Opportunity } from '../../models/oportunidades/Opportunity';
import { Project } from '../../models/Project';
import { ProjectFollower } from '../../models/oportunidades/ProjectFollower';
import { GridColDef } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import { RootState } from '../../redux/store';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import AddIcon from '@mui/icons-material/Add';
import { useUserOptions } from '../../hooks/useUserOptions';

interface props { 
    CODOS? : number;
    ID_PROJETO? : number
}
const OpportunityFollowerList = ({CODOS, ID_PROJETO}: props) => {


    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const [followers, setFollowers] = React.useState<ProjectFollower[]>([]);
    const [followerBeingDeleted, setFollowerBeingDeleted] = React.useState<ProjectFollower | null>(null);
    const [addingFollower, setAddingFollower] = React.useState<boolean>(false);

    const {userOptions} = useUserOptions();
  
  const handleDeleteFollower = () => {
    if (!user) return;
    if (!followerBeingDeleted) return;
    const { PERM_ADMINISTRADOR } = user;
    try {
      if (PERM_ADMINISTRADOR === 1) {
        ProjectService.deleteFollower(followerBeingDeleted.id_seguidor_projeto, followerBeingDeleted.id_projeto);
        setFollowers(
          followers.filter(
            (follower) =>
              follower.id_seguidor_projeto !==
              followerBeingDeleted.id_seguidor_projeto
          )
        );
        setFollowerBeingDeleted(null);

        dispatch(
          setFeedback({
            message: "Seguidor excluido com sucesso",
            type: "success",
          })
        );
      }
    } catch (err: any) {
      dispatch(
        setFeedback({
          message: `Erro ao excluir seguidor: ${err.message}`,
          type: "error",
        })
      );
    }
  };

  const fetchData = async () => {
    if(!CODOS && !ID_PROJETO) return;
    const opp : Opportunity = await OpportunityService.getById(Number(CODOS));
    const project : Project = await ProjectService.getById(Number(Number(opp.ID_PROJETO)));
    const {ID} = project;
    const followers = await ProjectService.getFollowers(ID);
    setFollowers(followers);
  }

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <Box>
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          Seguidores
        </Typography>
        <Tooltip title="Adicionar Seguidor">
          <IconButton
             onClick={() => setAddingFollower(true)}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              height: 30,
              width: 30,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
           
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <List
        sx={{
          dislpay: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {followers.map((follower) => (
          <ListItem
            sx={{
              backgroundColor: "white",
              border: "1px solid lightgray",
              mb: 1,
              height: 30,
              borderRadius: 1,
              padding: 1,
            }}
            key={follower.id_seguidor_projeto}
          >
            <Typography
              sx={{
                textTransform: "capitalize",
                fontSize: 14,
                fontWeight: "semibold",
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: { xs: "100%", md: "50%" },
              }}
            >
              {follower.pessoa.NOME}
            </Typography>
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => setFollowerBeingDeleted(follower)}
                color="error"
              >
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <BaseDeleteDialog
        open={Boolean(followerBeingDeleted)}
        onConfirm={handleDeleteFollower}
        onCancel={() => setFollowerBeingDeleted(null)}
      />
      <Dialog open={addingFollower}>
          <DialogTitle>
              <Typography variant='h6' fontWeight="bold" color="primary.main">
                  Adicionar Seguidor
              </Typography>
          </DialogTitle>
          <DialogContent>
              
          </DialogContent>
      </Dialog>
      
    </Box>
  );
}

export default OpportunityFollowerList