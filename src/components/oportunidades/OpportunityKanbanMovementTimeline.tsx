import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { KanbanBoardName } from "../../utils/kanbanFlowRules";
import OpportunityKanbanService, { OpportunityKanbanMovement } from "../../services/oportunidades/OpportunityKanbanService";

interface OpportunityKanbanMovementTimelineProps {
  CODOS: number;
  board: KanbanBoardName;
  open: boolean;
}

const formatDate = (value: string) => new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
}).format(new Date(value));

const OpportunityKanbanMovementTimeline = ({ CODOS, board, open }: OpportunityKanbanMovementTimelineProps) => {
  const [movements, setMovements] = useState<OpportunityKanbanMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    setError(false);
    OpportunityKanbanService.getMovementHistory(CODOS, board)
      .then((data) => { if (active) setMovements(data); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [CODOS, board, open]);

  return (
    <Accordion disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider", "&:before": { display: "none" } }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={600}>Histórico de movimentações</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}><CircularProgress size={22} /></Box>}
        {error && <Alert severity="error">Não foi possível carregar o histórico de movimentações.</Alert>}
        {!loading && !error && movements.length === 0 && (
          <Typography color="text.secondary" variant="body2">Ainda não há movimentações registradas.</Typography>
        )}
        {!loading && !error && movements.length > 0 && (
          <Stack spacing={1.5}>
            {movements.map((movement) => (
              <Box key={movement.id} sx={{ borderLeft: "2px solid", borderColor: "primary.light", pl: 1.5, py: 0.25 }}>
                <Typography variant="body2" fontWeight={600}>
                  {movement.coluna_origem_nome || "Entrada no quadro"} → {movement.coluna_destino_nome}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {movement.quadro} · {movement.usuario_nome || (movement.CODPESSOA ? `Usuário ${movement.CODPESSOA}` : "Sistema")} · {formatDate(movement.movimentado_em)}
                </Typography>
                {movement.origem !== "manual" && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {movement.origem === "automatica" ? "Movimento automático" : "Restauração"}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default OpportunityKanbanMovementTimeline;
