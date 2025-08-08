import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import MovementationService from '../../services/patrimonios/MovementationService';
import { Movimentation } from '../../models/patrimonios/Movementation';
import { useProjectOptions } from '../../hooks/projectOptionsHook';
import { useClientOptions } from '../../hooks/oportunidades/useClientOptions';
import { useUserOptions } from '../../hooks/useUserOptions';
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography, useTheme } from '@mui/material';
import useMovementationColumns from '../../hooks/patrimonios/useMovementationColumns';
import BaseDataTable from '../shared/BaseDataTable';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import { BaseAddButton } from '../shared/BaseAddButton';
import { Option } from '../../types';
import { formatDateToISOstring } from '../../utils';
import { useMovementationPermissions } from '../../hooks/patrimonios/useMovementationPermissions';


const PatrimonyMovementationTable = () => {
     
      const theme = useTheme();
      const {id_patrimonio} = useParams();
      const [rows, setRows] = React.useState<Partial<Movimentation>[]>([]);
      const {projectOptions} = useProjectOptions();
      const {userOptions} = useUserOptions();
      const [creating , setCreating] = React.useState(false);
      const [deletingMov, setDeletingMov] = React.useState<number | null>(null);
      const {permissionToCreateNew, permissionToDelete} = useMovementationPermissions(rows);
      const { columns } = useMovementationColumns(deletingMov, setDeletingMov, permissionToDelete);
      const [formData, setFormData] = React.useState<Partial<Movimentation>>({
        id_patrimonio: Number(id_patrimonio),
        id_projeto: 0,
        id_responsavel: 0
      });
      const user = useSelector((state: RootState) => state.user.user);
      const navigate = useNavigate();
      const dispatch = useDispatch();

      const deleteMov  = async () => {
        try {
          if(!deletingMov) return;
          await MovementationService.delete(deletingMov);
          dispatch(setFeedback({ message: 'Movimentação deletada com sucesso', type: 'success' }));
          setDeletingMov(null);
          setRows(
            rows.filter(
              (row: Partial<Movimentation>) =>
                row.id_movimentacao !== deletingMov
            )
          );
        } catch (error) {
          dispatch(setFeedback({ message: 'Erro ao deletar movimentação', type: 'error' }));
        }
      }

      const createMov = async ( ) => {
        try {
          const newMov = await MovementationService.create({...formData});
          dispatch(setFeedback({ message: 'Movimentação criada com sucesso', type: 'success' }));
          setCreating(false);
          setRows([newMov, ...rows]);
        } catch (error) {
          dispatch(setFeedback({ message: 'Erro ao criar movimentação', type: 'error' }));
        }
      }

  
      const fetchData = async () => {
        try {
            const data = await MovementationService.getMany({ 
               from: 'movimentacoes',
              id_patrimonio: Number(id_patrimonio)
            });
            setRows(data);
        } catch (error) {
          dispatch(setFeedback({ message: 'Erro ao buscar movimentações', type: 'error' }));
        }
      };

      useEffect(( )=>  {
        fetchData();
      }, [dispatch, id_patrimonio])

  return (
    <Box>
      <Box sx={{ width: "100%", height: "34px" }}>
        <Stack direction="row" gap={2}>
          <Typography variant="h6" color="primary.main" gutterBottom>
            Movimentações
          </Typography>
          {permissionToCreateNew && (
            <BaseAddButton
              handleOpen={() => setCreating(true)}
              text="Adicionar movimentação"
            />
          )}
        </Stack>
      </Box>
      <Box sx={{height: 300}}>
        <BaseDataTable
          rows={rows}
          columns={columns}
          disableColumnMenu
          getRowId={(row) => row.id_movimentacao}
          hideFooter
          rowHeight={36}
          theme={theme}
        />
      </Box>

      <Dialog open={creating} onClose={() => setCreating(false)}>
        <DialogTitle></DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            width: {
              xs: "100%",
              sm: "500px",
              md: "400px",
            },
          }}
        >
          <MovimentationForm
            formData={formData}
            setFormData={setFormData}
            onCancel={() => setCreating(false)}
            onConfirm={createMov}
            projectOptions={projectOptions}
            userOptions={userOptions}
          />
        </DialogContent>
      </Dialog>

      <BaseDeleteDialog
        open={deletingMov !== null}
        onConfirm={deleteMov}
        onCancel={() => setDeletingMov(null)}
      />
    </Box>
  );
}

function MovimentationForm(props: {
  formData: any,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  onCancel: () => void,
  onConfirm: () => void,
  projectOptions: Option[],
  userOptions: Option[]
}) {
  const { formData, setFormData, onCancel, onConfirm, projectOptions, userOptions } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [event.target.name]: Number(event.target.value) })
  }

  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{ width: '100%'}}
    >
      <Typography variant="h6" color="primary.main">
        Nova moviementação
      </Typography>
      <Autocomplete
        options={projectOptions}
        getOptionLabel={(option) => option.name}
        getOptionKey={(option) => option.id}
        value={projectOptions.find(
          (option) => option.id === formData.id_projeto
        )}
        slotProps={{
          paper: {
            style: {
              fontSize: "small",
            },
          },
        }}
        onChange={(event, newValue) => {
          setFormData({ ...formData, id_projeto: newValue ? newValue.id : 0 });
        }}
        fullWidth
        renderInput={(params) => <TextField {...params} label="Projeto" />}
      />

      <Autocomplete
        options={userOptions}
        getOptionLabel={(option) => option.name}
        getOptionKey={(option) => option.id}
        value={userOptions.find(
          (option) => option.id === formData.id_responsavel
        )}
        onChange={(event, newValue) => {
          setFormData({
            ...formData,
            id_responsavel: newValue ? newValue.id : 0,
          });
        }}
        slotProps={{
          paper: {
            style: {
              fontSize: "small",
            },
          },
        }}
        fullWidth
        renderInput={(params) => <TextField {...params} label="Responsável" />}
      />

      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="error" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          Cadastrar
        </Button>
      </Stack>
    </Stack>
  );
}

export default PatrimonyMovementationTable