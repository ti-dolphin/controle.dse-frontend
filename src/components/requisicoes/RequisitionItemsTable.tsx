import { GridCellModes, GridCellModesModel, GridCellParams, GridColDef, GridRowModel } from '@mui/x-data-grid'
import React, { useCallback, useEffect, useState } from 'react'
import { useRequisitionItemColumns } from '../../hooks/requisicoes/RequisitionItemColumnsHook';
import { RequisitionItem } from '../../models/requisicoes/RequisitionItem';
import { Box, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import RequisitionItemService from '../../services/requisicoes/RequisitionItemService';
import BaseDataTable from '../shared/BaseDataTable';
import BaseTableToolBar from '../shared/BaseTableToolBar';
import { debounce } from 'lodash';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { useRequisitionItemPermissions } from '../../hooks/requisicoes/RequisitionItemPermissionsHook';



const RequisitionItemsTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const requisition = useSelector((state: RootState) => state.requisition.requisition);
  const { editItemFieldsPermitted} = useRequisitionItemPermissions(user, requisition);
  const { columns } = useRequisitionItemColumns();
  const [searchTerm, setSearchTerm ] = useState('');
  const [items, setItems] = useState<RequisitionItem[]>([]);
  const [cellModesModel, setCellModesModel] =  React.useState<GridCellModesModel>({});
  const [loading, setLoading] = useState(false);

  const handleCellClick = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        dispatch(setFeedback({ 
          message: `O campo selecionado não é editável`,
          type: 'error'
        }));
        return;
      }
      if (editItemFieldsPermitted){
        dispatch(setFeedback({ 
          message: `Você não tem permissão para editar este campo`,
          type: 'error'
        }));
        return;
      }
        if (
          (event.target as any).nodeType === 1 &&
          !event.currentTarget.contains(event.target as Element)
        ) {
          // Ignore portal
          return;
        }
      setCellModesModel((prevModel) => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    []
  );

  const handleCellModesModelChange = React.useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    []
  );

  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel, oldRow: GridRowModel) => {
      const payload = {
        id_item_requisicao: newRow.id_item_requisicao,
        quantidade: newRow.quantidade,
        data_entrega: newRow.data_entrega,
        oc: newRow.oc,
        observacao: newRow.observacao,
      };
      try{ 
        const updatedItem = await RequisitionItemService.update(
          newRow.id_item_requisicao,
          payload
        );
        return updatedItem;
      }catch(e : any){ 
        dispatch(setFeedback({ 
          message: `Erro ao atualizar item da requisição: ${e.message}`,
          type: 'error'
        }));
        return oldRow;
      }
    },
    []
  );

  const changeSearchTerm = (e: React.ChangeEvent<HTMLInputElement> ) => { 
      const value = e.target.value;
      setSearchTerm(value.toLowerCase());
  };

  const debouncedHandleChangeSearchTerm = debounce(changeSearchTerm, 500);


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await RequisitionItemService.getMany({
        id_requisicao: requisition.ID_REQUISICAO,
        searchTerm,
      });
      setItems(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      dispatch(
        setFeedback({
          message: "Erro ao buscar itens da requisição",
          type: "error",
        })
      );
    }
  }, [dispatch, requisition.ID_REQUISICAO, searchTerm]);

  useEffect(() => { 
    console.log("useEffect")
    if(requisition){ 
      fetchData();
    }
  }, [dispatch, requisition.ID_REQUISICAO, fetchData])

  return (
    <Box>
      <BaseTableToolBar
        handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
      />
      <BaseDataTable
        density="compact"
        getRowId={(row: any) => row.id_item_requisicao}
        loading={loading}
        theme={theme}
        rows={items}
        columns={columns}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
        processRowUpdate={processRowUpdate}
        hideFooter
      />
    </Box>
  );
}

export default RequisitionItemsTable