import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import BaseDataTable from "../shared/BaseDataTable";
import {
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridRowModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { set } from "lodash";
import CircularProgress from "@mui/material/CircularProgress";

interface UpdateChildReqItemsDialogProps {
  open: boolean;
  onClose: () => void;
  id_requisicao: number;
  items: any[];
  allItems: any[];
}

const UpdateChildReqItemsDialog = ({
  open,
  onClose,
  id_requisicao,
  items,
  allItems,
}: UpdateChildReqItemsDialogProps) => {
  const [rows, setRows] = useState(items);
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const [triggerFunction, setTriggerFunction] = useState<
    "createParcialReq" | "none"
  >("none");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const apiRef = useGridApiRef();

  const columns: GridColDef[] = [
    {
      field: "id_item_requisicao",
      headerName: "ID",
      width: 100,
      editable: false,
    },
    {
      field: "produto_descricao",
      headerName: "Descrição",
      width: 300,
      editable: false,
    },
    {
      field: "produto_unidade",
      headerName: "Unidade",
      width: 100,
      editable: false,
    },
    {
      field: "quantidade",
      headerName: "Quantidade",
      width: 100,
      editable: true,
    },
  ];

  const handleCellClick = (params: GridCellParams, event: React.MouseEvent) => {
    if (
      (event.target as any).nodeType === 1 &&
      !event.currentTarget.contains(event.target as Element)
    ) {
      return;
    }
    setCellModesModel((prevModel) => ({
      // Revert the mode of other cells
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
        // Revert other cells in the same row
        ...Object.keys(prevModel[params.id] || {}).reduce(
          (acc, field) => ({
            ...acc,
            [field]: { mode: GridCellModes.View },
          }),
          {}
        ),
        [params.field]: { mode: GridCellModes.Edit },
      },
    }));
  };

  const handleCellModesModelChange = (newModel: GridCellModesModel) => {
    setCellModesModel(newModel);
  };

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    console.log("processRowUpdate");
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id_item_requisicao === newRow.id_item_requisicao ? newRow : row
      )
    );
    return newRow;
  };

  const validateItems = () => {
    if(items.length === allItems.length){ 
        const parcialItemIdToOriginalItemMap = new Map();
        items.forEach((item : any) => {
          const originalItem = allItems.find((i) => i.id_item_requisicao === item.id_item_requisicao);
          parcialItemIdToOriginalItemMap.set(item.id_item_requisicao, originalItem);
        });
        const hasDifferentQtyItem = rows.some((item : any) => {
          const originalItem = parcialItemIdToOriginalItemMap.get(item.id_item_requisicao);
          return originalItem.quantidade !== item.quantidade;
        });
        if(!hasDifferentQtyItem){
          throw new Error("Não é permitido criar uma requisição parcial com todos os itens iguais a original");
        }
    }
  }

  const createParcialReq = useCallback(async () => {
    setLoading(true);
    try {
      validateItems()
      const newRequisition = await RequisitionService.createFromOther(id_requisicao, rows);
      if (newRequisition) {
        navigate(`/requisicoes/${newRequisition.ID_REQUISICAO}`);
      }
      setTriggerFunction("none");
      onClose();
    } catch (e : any) {
       setTriggerFunction("none");
      console.error(e);
      dispatch(
        setFeedback({
          message: `Erro ao criar requisição parcial: ${e.message}`,
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [triggerFunction]);

  const handleCreateButtonClick = async () => {
    // Stop editing any cell to trigger processRowUpdate
    try {
      apiRef.current.stopCellEditMode({
        id: Object.keys(cellModesModel)[0],
        field: Object.keys(cellModesModel[Object.keys(cellModesModel)[0]])[0],
        ignoreModifications: false,
      });
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setTriggerFunction("createParcialReq");
    }, 1000);
    // Wait for state to update (optional: small delay to ensure state propagation)
  };

  useEffect(() => {
    if(triggerFunction === "createParcialReq") {
      createParcialReq();
    }
  }, [triggerFunction]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h6" color="primary.main">
          Insira as quantidades desejadas para a requisição parcial
        </Typography>
        <Typography fontSize="small" fontStyle="italic" fontWeight="light">
          Caso não seja informado as quantidades, as quantidades da requisição
          original serão utilizadas
        </Typography>
      </DialogTitle>
      <DialogContent>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon color="error" />
        </IconButton>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 400 }}>
            <BaseDataTable
              apiRef={apiRef}
              density="compact"
              rows={rows}
              getRowId={(row) => row.id_item_requisicao}
              columns={columns}
              processRowUpdate={processRowUpdate}
              onCellClick={handleCellClick}
              onCellModesModelChange={handleCellModesModelChange}
              cellModesModel={cellModesModel}
              disableRowSelectionOnClick
              theme={theme}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleCreateButtonClick}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          Criar Requisição Parcial
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateChildReqItemsDialog;
