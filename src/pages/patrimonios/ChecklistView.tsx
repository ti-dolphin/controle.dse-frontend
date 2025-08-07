import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { Checklist } from "../../models/patrimonios/Checklist";
import { CheckListService } from "../../services/patrimonios/ChecklistService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { ChecklistItem } from "../../models/patrimonios/ChecklistItem";
import { Box, Button, Grid, Stack } from "@mui/material";
import ChecklistItemCard from "./ChecklistItemCard";
import { useChecklistPermission } from "../../hooks/patrimonios/useChecklistPermission";
import { rearg } from "lodash";
import { updateSingleRow } from "../../redux/slices/patrimonios/ChecklistTableSlice";

interface ChecklistViewProps{ 
    id_checklist: number
};
const ChecklistView = ({id_checklist} : ChecklistViewProps) => {
  const dispatch = useDispatch();
  const [checklist, setChecklist] = useState<Partial<Checklist>>({});
  const [items, setItems] = useState<Partial<ChecklistItem>[]>([]);
  const [loading, setLoading] = useState(false);
  const {permissionToFullfill, permissionToAprove} = useChecklistPermission(checklist)


  const updateSingleItem = (
    item: Partial<ChecklistItem>,
    id_item_checklist_movimentacao: number
  ) => {
    let updatedItem = items.find((item) => item.id_item_checklist_movimentacao === id_item_checklist_movimentacao);
    if (!updatedItem) return;
    updatedItem = { ...updatedItem, ...item };
    const updatedItems = items.map((item) => {
      if (item.id_item_checklist_movimentacao === id_item_checklist_movimentacao) {
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const concludeChecklist = async () => {
      if(!checklist) return;
       try {
         const { id_checklist_movimentacao } = checklist;
         const updatedChecklist = await CheckListService.update(
           Number(id_checklist_movimentacao),
           { aprovado: false, realizado: true }
         );
         setChecklist(updatedChecklist);
         //update checklist row on the table
         dispatch(updateSingleRow(updatedChecklist));
         dispatch(
           setFeedback({
             message: "Checklist foi concluído, aguardar aprovação!",
             type: "success",
           })
         );
       } catch (e: any) {
         console.log("error: ", e);
         dispatch(
           setFeedback({
             message: `Erro ao concluir checklist: ${e.message}`,
             type: "error",
           })
         );
       }
  }

  const aproveChecklist = async () => {
     if (!checklist) return;
    try {
      const { id_checklist_movimentacao } = checklist;
      const updatedChecklist = await CheckListService.update(
        Number(id_checklist_movimentacao),
        { aprovado: true }
      );
      setChecklist(updatedChecklist);
      //update checklist row on the table
      dispatch(updateSingleRow(updatedChecklist));
      dispatch(
        setFeedback({
          message: "Checklist aprovado!",
          type: "success",
        })
      )
    } catch (e: any) {
      console.log("error: ", e);
      dispatch(
        setFeedback({
          message: `Erro ao aprovar checklist : ${e.message}`,
          type: "error",
        })
      );
    }
  };

  const reproveChecklist = async () => {
    console.log("reprovando checklist");
       if (!checklist) return;
       try {
         const { id_checklist_movimentacao } = checklist;
         const updatedChecklist = await CheckListService.update(
           Number(id_checklist_movimentacao),
           { aprovado: false, realizado :false }
         );
         setChecklist(updatedChecklist);
         dispatch(updateSingleRow(updatedChecklist));
         dispatch(
           setFeedback({
             message: "Checklist reprovado!",
             type: "success",
           })
         );
       } catch (e: any) {
         console.log("error: ", e);
         dispatch(
           setFeedback({
             message: `Erro ao reprovar checklist : ${e.message}`,
             type: "error",
           })
         );
       }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await CheckListService.getById(id_checklist);
      console.log("checklist: ", data);
      setChecklist(data);
      setItems(data.items);
      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
      setLoading(false);
      dispatch(setFeedback({
        message: 'Failed to fetch checklist data',
        type: 'error',
      }));
    }
  };
  useEffect(() =>  {
    fetchData();
  }, [])
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
        {items.map((item, index) => (
          <Grid item key={index} xs={1} sm={1} md={1} lg={1}>
            <ChecklistItemCard
              updateSingleItem={updateSingleItem}
              checklist={checklist}
              checklistItem={item as ChecklistItem}
            />
          </Grid>
        ))}
      </Grid>
      {permissionToAprove && (
        <Stack direction="row" gap={2}>
          <Button onClick={aproveChecklist} variant="contained">Aprovar</Button>
          <Button onClick={reproveChecklist} variant="contained" color="error">
            Reprovar
          </Button>
        </Stack>
      )}
      {permissionToFullfill && (
        <Button variant="contained" onClick={concludeChecklist}>
          Concluir
        </Button>
      )}
    </Box>
  );
};
  
export default ChecklistView
