import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setRows,
  setSelectedRow,
  setKanbans,
  setSelectedKanban,
  setLoading,
} from "../../../redux/slices/requisicoes/requisitionTableSlice";
import { setFeedback } from "../../../redux/slices/feedBackSlice";
import RequisitionService from "../../../services/requisicoes/RequisitionService";
import { Box, Button, ButtonGroup, CircularProgress, Grid, SelectChangeEvent, useTheme } from "@mui/material";
import { useRequisitionColumns } from "../hooks/RequisitionTableColumnsHook";
import BaseDataTable from "../../../components/shared/BaseDataTable";
import BaseDetailModal from "../../../components/shared/BaseDetailModal";
import { useGridApiRef } from "@mui/x-data-grid";
import { RequisitionKanban } from "../../../models/requisicoes/RequisitionKanban";
import { useRequisitionKanban } from "../hooks/RequisitionKanbanHook";
import BaseToolBar from "../../../components/shared/BaseToolBar";import BaseDropdown from "../../../components/shared/BaseDropdown";
import { ReducedUser } from "../../../models/User";


const RequisitionListPage = () => {
  useRequisitionKanban();
  const dispatch = useDispatch();
  const theme = useTheme();

  const user = useSelector((state: RootState) => state.user.user);

  const rows = useSelector((state: RootState) => state.requisitionTable.rows);

  const loading = useSelector(
    (state: RootState) => state.requisitionTable.loading
  );

  const selectedRow = useSelector(
    (state: RootState) => state.requisitionTable.selectedRow
  );

  const kanbans = useSelector(
    (state: RootState) => state.requisitionTable.kanbans
  );

  const selectedKanban = useSelector(
    (state: RootState) => state.requisitionTable.selectedKanban
  );

  const changeSelectedRow = (row: any) => {
    dispatch(setSelectedRow(row));
  };
  const gridRef = useGridApiRef();
  const { columns, secondaryColumns } = useRequisitionColumns(changeSelectedRow);


  const handleChangeKanban = (event: SelectChangeEvent<unknown>) => {
    const selectedKanban = kanbans.find(
      (kanban: RequisitionKanban) =>
        kanban.id_kanban_requisicao === Number(event.target.value)
    );
    if (selectedKanban) {
      dispatch(setSelectedKanban(selectedKanban));
      return;
    }
  };
  


  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const data = await RequisitionService.getMany(user as ReducedUser, { 
          id_kanban_requisicao: selectedKanban?.id_kanban_requisicao
        });
        dispatch(setRows(data));
        dispatch(setLoading(false));
      } catch (e: any) {
        dispatch(setLoading(false));
        dispatch(
          setFeedback({
            message: "Houve um erro ao buscar requisições",
            type: "error",
          })
        );
      }
    };
    if(selectedKanban && user){ 
      fetchData();
    }
  }, [selectedKanban]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          height: "90%",
          width: "90%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BaseToolBar>
          <BaseDropdown
            label={"Etapa"}
            options={kanbans.map((kanban: RequisitionKanban) => ({
              label: kanban.nome,
              value: kanban.id_kanban_requisicao,
            }))}
            value={String(selectedKanban?.id_kanban_requisicao)}
            onChange={handleChangeKanban}
            backgroundColor="secondary.main"
          />
        </BaseToolBar>
         { 
          loading ? ( 
            <Box sx={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress sx={{color: 'primary.main'}}/>
            </Box>
          ) : ( 
            <BaseDataTable
            apiRef={gridRef}
            rows={rows}
            rowHeight={44}
            columns={columns}
            loading={loading}
            getRowId={(row: any) => row.ID_REQUISICAO}
            theme={theme} />
          )
         }
      </Box>
      <BaseDetailModal
        open={selectedRow !== null}
        onClose={() => dispatch(setSelectedRow(null))}
        columns={secondaryColumns}
        row={selectedRow}
        ref={gridRef}
      />
    </Box>
  );
};

export default RequisitionListPage;
