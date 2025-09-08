import React, { useCallback, useEffect, useState } from 'react'
import { useOpportunityColumns } from '../../hooks/oportunidades/useOpportunityColumns';
import { useDispatch, useSelector } from 'react-redux';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import { RootState } from '../../redux/store';
import BaseTableToolBar from '../shared/BaseTableToolBar';
import { setLoading, setRows, setSearchTerm, setTotals } from '../../redux/slices/oportunidades/opportunityTableSlice';
import { debounce } from 'lodash';
import BaseDataTable from '../shared/BaseDataTable';
import { Badge, Box, Button, Checkbox, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { setCreating } from '../../redux/slices/oportunidades/opportunitySlice';
import OpportunityFormModal from './OpportunityFormModal';
import { useNavigate } from 'react-router-dom';
import BaseTableColumnFilters from '../shared/BaseTableColumnFilters';
import { useOpportunityFilters } from '../../hooks/oportunidades/useOpportunityFilters';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { GridFooter, GridRemoveIcon } from '@mui/x-data-grid';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { OpportunityTableFooter } from './OpportunityTableFooter';
import { useIsMobile } from '../../hooks/useIsMobile';
import { FixedSizeGrid } from 'react-window';
import OpportunityCard from './OpportunityCard';
const OpportunityTable = () => {
  console.log("OpportunityTable");
 const dispatch = useDispatch();
 const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
 const {loading, rows, searchTerm } = useSelector((state: RootState) => state.opportunityTable);
 const { columns } = useOpportunityColumns();
 const theme=  useTheme();
const toolbarRef = React.useRef<HTMLDivElement>(null);
const [toolbarHeight, setToolbarHeight] = useState(0);
const [columnFiltersHeight, setColumnFiltersHeight] = useState(0);
const columnFiltersRef = React.useRef<HTMLDivElement>(null);
const { filters, handleChangeFilters, clearFilters , activeFilters} = useOpportunityFilters();
const [finalizados, setFinalizados] = useState(false);
const {isMobile } = useIsMobile();
const gridContainerRef = React.useRef<HTMLDivElement>(null);
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

 const handleCleanFilters = ( ) => { 
     clearFilters();
 }

 const fetchData = useCallback(async () => {
   if (user) {
    dispatch(setLoading(true));
     try {
       const { opps, total, totalFatDolphin, totalFatDireto } =
         await OpportunityService.getMany({
           user: user,
           searchTerm,
           filters,
           finalizados,
         });
       dispatch(setRows(opps));
       dispatch(
          setTotals({
            total,
            totalFatDolphin,
            totalFatDireto,
          })
        );
       dispatch(setLoading(false));
     } catch (e: any) {
       dispatch(setLoading(false));
       setFeedback({
         message: `Erro ao buscar oportunidades: ${e.message}`,
         type: "error",
       });
     }
   }
 }, [dispatch, searchTerm, filters, finalizados]);

 useEffect(() => {
   fetchData();
 }, [fetchData]);

 useEffect(()=> {
   if (toolbarRef.current) {
     setToolbarHeight(toolbarRef.current.clientHeight);
   }
   if (columnFiltersRef.current) {
     setColumnFiltersHeight(columnFiltersRef.current.clientHeight);
   }
   //log heihgts
 }, [toolbarRef.current, columnFiltersRef.current]);

  return (
    <Box sx={{ height: "100%" }}>
      <Paper elevation={2}>
       
          <BaseTableToolBar handleChangeSearchTerm={handleChangeSearchTerm}>
            <IconButton
              onClick={openFormModal}
              sx={{
                bgcolor: "secondary.main",
                color: "white",
                borderRadius: "50%",
                height: 24,
                width: 24,
                "&:hover": {
                  bgcolor: "secondary.main",
                },
              }}
            >
              <AddIcon />
            </IconButton>

            {!isMobile && (
              <Button
                variant="contained"
                sx={{ maxHeight: "30px", borderRadius: "0" }}
                onClick={handleCleanFilters}
              >
                <Stack direction={"row"} alignItems={"center"} gap={1}>
                  <Typography fontSize="12px">Limpar filtros</Typography>
                </Stack>
              </Button>
            )}
            <Stack direction={"row"} alignItems={"center"}  gap={1}>
              <Checkbox
                checkedIcon={<CheckCircleIcon />}
                icon={<RadioButtonUncheckedIcon />}
                onChange={(e) => {
                  setFinalizados(e.target.checked);
                }}
              />
              <Typography fontSize="12px">Finalizados</Typography>
            </Stack>
            <OpportunityFormModal />
          </BaseTableToolBar>
   
      </Paper>
      <Paper
        elevation={2}
        sx={{
          height: `calc(92vh - ${toolbarHeight}px)`,
          overflow: "hidden",
          display: "flex",
  
        }}
      >
        {!isMobile && (
        
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
              slots={{
                footer: () => <OpportunityTableFooter />,
              }}
            />
        )}
        {isMobile && (
          <Box ref={gridContainerRef} sx={{border: '1px solid', mt: 6, height: '90%', overflow: 'hidden'}}>
              <FixedSizeGrid
                      rowCount={rows.length}
                      columnCount={1}
                      columnWidth={280}
                      height={gridContainerRef.current?.offsetHeight || 0}
                      rowHeight={310}
                      width={300}
                    >
                      {({ columnIndex, rowIndex, style }) => {
                        const row = rows[rowIndex];
                        return (
                          <OpportunityCard styles={style} key={row.CODOS} row={row} />
                        );
                      }}
                    </FixedSizeGrid>
          </Box>
         
        )}
      </Paper>
    </Box>
  );
}

export default OpportunityTable