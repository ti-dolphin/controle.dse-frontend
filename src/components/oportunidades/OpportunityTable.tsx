import React, { useCallback, useEffect, useState } from 'react'
import { useOpportunityColumns } from '../../hooks/oportunidades/useOpportunityColumns';
import { useDispatch, useSelector } from 'react-redux';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import { RootState } from '../../redux/store';
import BaseTableToolBar from '../shared/BaseTableToolBar';
import { setRows, setSearchTerm } from '../../redux/slices/oportunidades/opportunityTableSlice';
import { debounce } from 'lodash';
import BaseDataTable from '../shared/BaseDataTable';
import { useGridApiRef } from '@mui/x-data-grid';
import { Box, IconButton, Paper, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { setCreating } from '../../redux/slices/oportunidades/opportunitySlice';
import OpportunityFormModal from './OpportunityFormModal';
import { useNavigate } from 'react-router-dom';
import UpperNavigation from '../shared/UpperNavigation';

const OpportunityTable = () => {
 const dispatch = useDispatch();
 const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
 const {loading, rows, searchTerm } = useSelector((state: RootState) => state.opportunityTable);
 const { columns } = useOpportunityColumns();
 const gridRef = useGridApiRef(); 
 const theme=  useTheme();
const toolbarRef = React.useRef<HTMLDivElement>(null);
const [toolbarHeight, setToolbarHeight] = useState(0);
 const changeSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
   dispatch(setSearchTerm(event.target.value)); 
 };

 const handleChangeSearchTerm = debounce(changeSearchTerm, 500);

 const openFormModal = () => {
   dispatch(setCreating(true));
 }

 const navigateToOppDetails = (id : number ) => { 
   navigate(`/oportunidades/${id}`);
 };

 const fetchData = useCallback(async () => {
    if(user){ 
       const data = await OpportunityService.getMany({
         user: user,
         searchTerm,
         filters : {},
         finalizados: false
       });
       dispatch(setRows(data));
    }

 }, [dispatch, searchTerm]);

 useEffect(() => {
   fetchData();
 }, [fetchData]);

 useEffect(()=> { 
  if(toolbarRef.current){ 
    setToolbarHeight(toolbarRef.current.clientHeight);
  }
 }, [toolbarRef]);

  return (
    <Box sx={{ height: "100%", overflow: "hidden",  }}>
     
      <Paper elevation={2}  ref={toolbarRef}>
        <BaseTableToolBar handleChangeSearchTerm={handleChangeSearchTerm}>
          <IconButton
            onClick={openFormModal}
            sx={{
              bgcolor: "secondary.main",
              color: "white",
              borderRadius: "50%",
              "&:hover": {
                bgcolor: "secondary.main",
              },
            }}
          >
            <AddIcon />
          </IconButton>
          <OpportunityFormModal />
        </BaseTableToolBar>
      </Paper>
      <Paper 
        elevation={2}
        sx={{
          height: `calc(100% - ${toolbarHeight}px)`,
          overflow: "auto",
        }}
      >
        <BaseDataTable
          rows={rows}
          columns={columns}
          loading={loading}
          disableColumnMenu
          disableColumnFilter
          rowHeight={36}
          onRowClick={(params) => navigateToOppDetails(Number(params.id))}
          // onRowClick={(params) => navigateToRequisitionDetails(params)}
          getRowId={(row: any) => row.CODOS}
          theme={theme}
        />
      </Paper>
    </Box>
  );
}

export default OpportunityTable