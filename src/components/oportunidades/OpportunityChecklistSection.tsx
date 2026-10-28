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
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { KanbanChecklistService } from "../../services/oportunidades/KanbanChecklistService";
import { KanbanChecklistItemService } from "../../services/oportunidades/KanbanChecklistItemService";
import OpportunityService from "../../services/oportunidades/OpportunityService";
import { ProjectService } from "../../services/ProjectService";
import { KanbanChecklist } from "../../models/oportunidades/KanbanChecklist";
import { KanbanChecklistItem } from "../../models/oportunidades/KanbanChecklistItem";
import { ProjectFollower } from "../../models/oportunidades/ProjectFollower";

interface OpportunityChecklistSectionProps {
  CODOS: number;
  showStatusDots?: boolean;
}

const OpportunityChecklistSection = ({ CODOS, showStatusDots = false }: OpportunityChecklistSectionProps) => {
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState<ProjectFollower[]>([]);
  const [checklists, setChecklists] = useState<KanbanChecklist[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [addingForFollower, setAddingForFollower] = useState<number | null>(null);
  const [newItemText, setNewItemText] = useState("");

  const fetchChecklists = useCallback(async () => {
    if (!CODOS) return;
    setLoading(true);
    try {
      const opportunity = await OpportunityService.getById(CODOS);
      const projectFollowers = await ProjectService.getFollowers(Number(opportunity.ID_PROJETO));
      const activeFollowers = projectFollowers.filter(
        (follower) => follower.ativo !== false && Number(follower.pessoa.PERM_CRM) === 1
      );
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

  const getFollowerChecklistStatus = (followerChecklists: KanbanChecklist[]) => {
    const yellowOrders = [1, 2, 3, 4, 5, 7, 8, 11, 14, 15, 16, 17, 18, 22, 24];
    const greenOrders = [6, 9, 12, 19, 20, 21, 23];
    if (followerChecklists.length === 0) return "red";

    const checklistStatuses = followerChecklists.map((checklist) => {
      const doneOrders = new Set(checklist.itens.filter((item) => item.concluido).map((item) => item.ordem));
      if (!yellowOrders.every((order) => doneOrders.has(order))) return 0;
      if (!greenOrders.every((order) => doneOrders.has(order))) return 1;
      return 2;
    });
    return ["red", "yellow", "green"][Math.min(...checklistStatuses)];
  };

  const statusColor = (status: string) => {
    const colors: Record<string, string> = { red: "error.main", yellow: "warning.main", green: "success.main" };
    return colors[status] || colors.red;
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = { red: "vermelho", yellow: "amarelo", green: "verde" };
    return labels[status] || labels.red;
  };

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
    try {
      const item = await KanbanChecklistItemService.create({
        id_checklist: checklist.id_checklist,
        descricao,
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
        followers.map((follower) => {
            const followerChecklists = checklists.filter(
              (checklist) => checklist.id_seguidor_projeto === follower.id_seguidor_projeto
            );
            const followerItems = followerChecklists.flatMap((checklist) => checklist.itens);
            const followerDone = followerItems.filter((item) => item.concluido).length;

            return (
              <Accordion key={follower.id_seguidor_projeto} disableGutters sx={{ mb: 0.75, borderRadius: 1, "&:before": { display: "none" } }}>
                <AccordionSummary
                  expandIcon={
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {showStatusDots && (
                        <Tooltip title={`Preenchimento: ${statusLabel(getFollowerChecklistStatus(followerChecklists))}`}>
                          <Box aria-label={`Preenchimento ${statusLabel(getFollowerChecklistStatus(followerChecklists))}`} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: statusColor(getFollowerChecklistStatus(followerChecklists)) }} />
                        </Tooltip>
                      )}
                      <ExpandMoreIcon />
                    </Stack>
                  }
                >
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
                      {checklist.itens.map((item) => (
                        <Stack
                          key={item.id_item}
                          direction="row"
                          alignItems="center"
                          sx={{ backgroundColor: "white", borderRadius: 1, mb: 0.5, pr: 1 }}
                        >
                          <Checkbox size="small" checked={item.concluido} onChange={() => handleToggleItem(checklist, item)} />
                          <Typography
                            variant="body2"
                            sx={{ flex: 1, textDecoration: item.concluido ? "line-through" : "none", color: item.concluido ? "text.secondary" : "text.primary" }}
                          >
                            {item.descricao}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            );
        })
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

    </Box>
  );
};

export default OpportunityChecklistSection;
