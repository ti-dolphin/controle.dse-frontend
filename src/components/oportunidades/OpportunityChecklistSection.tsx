import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  LinearProgress,
  Checkbox,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { KanbanChecklistService } from "../../services/oportunidades/KanbanChecklistService";
import { KanbanChecklistItemService } from "../../services/oportunidades/KanbanChecklistItemService";
import OpportunityService from "../../services/oportunidades/OpportunityService";
import { ProjectService } from "../../services/ProjectService";
import { KanbanChecklist } from "../../models/oportunidades/KanbanChecklist";
import { KanbanChecklistItem } from "../../models/oportunidades/KanbanChecklistItem";
import { ProjectFollower } from "../../models/oportunidades/ProjectFollower";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";

interface OpportunityChecklistSectionProps {
  CODOS: number;
}

const OpportunityChecklistSection = ({ CODOS }: OpportunityChecklistSectionProps) => {
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState<ProjectFollower[]>([]);
  const [checklists, setChecklists] = useState<KanbanChecklist[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [addingForFollower, setAddingForFollower] = useState<number | null>(null);
  const [newItemText, setNewItemText] = useState("");
  const [itemToDelete, setItemToDelete] = useState<{ checklist: KanbanChecklist; item: KanbanChecklistItem } | null>(null);

  const fetchChecklists = useCallback(async () => {
    if (!CODOS) return;
    setLoading(true);
    try {
      const opportunity = await OpportunityService.getById(CODOS);
      const projectFollowers = await ProjectService.getFollowers(Number(opportunity.ID_PROJETO));
      const activeFollowers = projectFollowers.filter((follower) => follower.ativo !== false);
      const followerChecklists = await Promise.all(
        activeFollowers.map((follower) =>
          KanbanChecklistService.aplicarModelo(CODOS, follower.id_seguidor_projeto)
        )
      );
      setFollowers(activeFollowers);
      setChecklists(followerChecklists.flat());
    } catch {
      dispatch(setFeedback({ message: "Erro ao carregar checklists", type: "error" }));
    } finally {
      setLoading(false);
    }
  }, [CODOS, dispatch]);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  const allItems = checklists.flatMap((checklist) => checklist.itens);
  const total = allItems.length;
  const done = allItems.filter((item) => item.concluido).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const handleToggleItem = async (checklist: KanbanChecklist, item: KanbanChecklistItem) => {
    try {
      const updated = await KanbanChecklistItemService.update(item.id_item, {
        concluido: !item.concluido,
      });
      setChecklists((prev) =>
        prev.map((current) =>
          current.id_checklist === checklist.id_checklist
            ? { ...current, itens: current.itens.map((entry) => (entry.id_item === item.id_item ? updated : entry)) }
            : current
        )
      );
    } catch {
      dispatch(setFeedback({ message: "Erro ao atualizar item", type: "error" }));
    }
  };

  const handleAddItem = async () => {
    if (addingForFollower === null) return;
    const checklist = checklists.find((entry) => entry.id_seguidor_projeto === addingForFollower);
    const descricao = newItemText.trim();
    if (!checklist || !descricao) return;
    const checklistItems = checklist.itens;
    const ordem = checklistItems.length > 0 ? Math.max(...checklistItems.map((item) => item.ordem)) + 1 : 1;
    try {
      const item = await KanbanChecklistItemService.create({
        id_checklist: checklist.id_checklist,
        descricao,
        ordem,
      });
      setChecklists((prev) => prev.map((entry) =>
        entry.id_checklist === checklist.id_checklist ? { ...entry, itens: [...entry.itens, item] } : entry
      ));
      setNewItemText("");
      setAddingItem(false);
      setAddingForFollower(null);
    } catch {
      dispatch(setFeedback({ message: "Erro ao adicionar item", type: "error" }));
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      await KanbanChecklistItemService.delete(itemToDelete.item.id_item);
      setChecklists((prev) => prev.map((entry) =>
        entry.id_checklist === itemToDelete.checklist.id_checklist
          ? { ...entry, itens: entry.itens.filter((item) => item.id_item !== itemToDelete.item.id_item) }
          : entry
      ));
    } catch {
      dispatch(setFeedback({ message: "Erro ao excluir item", type: "error" }));
    } finally {
      setItemToDelete(null);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.droppableId !== destination.droppableId || source.index === destination.index) return;
    const checklistId = Number(source.droppableId);
    const checklist = checklists.find((entry) => entry.id_checklist === checklistId);
    if (!checklist) return;

    const reordered = Array.from(checklist.itens);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    const orderedItems = reordered.map((item, index) => ({ ...item, ordem: index + 1 }));
    setChecklists((prev) => prev.map((entry) =>
      entry.id_checklist === checklistId ? { ...entry, itens: orderedItems } : entry
    ));

    try {
      await KanbanChecklistItemService.reordenar(
        orderedItems.map((item) => ({ id_item: item.id_item, ordem: item.ordem }))
      );
    } catch {
      dispatch(setFeedback({ message: "Erro ao reordenar itens", type: "error" }));
      fetchChecklists();
    }
  };

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}><CircularProgress size={24} /></Box>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="subtitle1" color="primary.main" fontWeight="bold" sx={{ mb: 1 }}>
        Checklists
      </Typography>

      {total > 0 && (
        <Box sx={{ mb: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">{done}/{total} concluídos</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">{pct}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
      )}

      {followers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Adicione um seguidor para exibir o checklist.</Typography>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          {followers.map((follower) => {
            const followerChecklists = checklists.filter(
              (checklist) => checklist.id_seguidor_projeto === follower.id_seguidor_projeto
            );
            const followerItems = followerChecklists.flatMap((checklist) => checklist.itens);
            const followerDone = followerItems.filter((item) => item.concluido).length;

            return (
              <Accordion key={follower.id_seguidor_projeto} disableGutters sx={{ mb: 0.75, borderRadius: 1, "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%", pr: 1 }}>
                    <Typography variant="body2" fontWeight="bold">{follower.pessoa.NOME}</Typography>
                    <Typography variant="caption" color="text.secondary">{followerDone}/{followerItems.length} concluídos</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      disabled={followerChecklists.length === 0}
                      onClick={() => {
                        setAddingForFollower(follower.id_seguidor_projeto);
                        setAddingItem(true);
                      }}
                    >
                      Adicionar item
                    </Button>
                  </Stack>
                  {followerChecklists.length === 0 && (
                    <Typography variant="body2" color="text.secondary">Nenhum modelo de checklist cadastrado.</Typography>
                  )}
                  {followerChecklists.map((checklist) => (
                    <Box key={checklist.id_checklist} sx={{ mb: 1.5 }}>
                      {followerChecklists.length > 1 && (
                        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ display: "block", mb: 0.5 }}>
                          {checklist.nome}
                        </Typography>
                      )}
                      <Droppable droppableId={String(checklist.id_checklist)}>
                        {(provided) => (
                          <Box ref={provided.innerRef} {...provided.droppableProps}>
                            {checklist.itens.map((item, index) => (
                              <Draggable key={item.id_item} draggableId={String(item.id_item)} index={index}>
                                {(dragProvided) => (
                                  <Stack
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    direction="row"
                                    alignItems="center"
                                    sx={{ backgroundColor: "white", borderRadius: 1, mb: 0.5, pr: 1 }}
                                  >
                                    <Box {...dragProvided.dragHandleProps} sx={{ display: "flex", color: "text.secondary" }}>
                                      <DragIndicatorIcon fontSize="small" />
                                    </Box>
                                    <Checkbox size="small" checked={item.concluido} onChange={() => handleToggleItem(checklist, item)} />
                                    <Typography
                                      variant="body2"
                                      sx={{ flex: 1, textDecoration: item.concluido ? "line-through" : "none", color: item.concluido ? "text.secondary" : "text.primary" }}
                                    >
                                      {item.descricao}
                                    </Typography>
                                    <IconButton size="small" onClick={() => setItemToDelete({ checklist, item })}>
                                      <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </Stack>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </DragDropContext>
      )}

      <Dialog open={addingItem} onClose={() => { setAddingItem(false); setAddingForFollower(null); }} maxWidth="xs" fullWidth>
        <DialogTitle>Adicionar item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus fullWidth multiline size="small" placeholder="Descrição do item"
            value={newItemText}
            onChange={(event) => setNewItemText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleAddItem();
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddingItem(false); setAddingForFollower(null); }}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddItem}>Adicionar</Button>
        </DialogActions>
      </Dialog>

      <BaseDeleteDialog open={!!itemToDelete} onConfirm={handleDeleteItem} onCancel={() => setItemToDelete(null)} />
    </Box>
  );
};

export default OpportunityChecklistSection;
