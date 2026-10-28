import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import OpportunityKanbanService, { OpportunityKanbanMovement } from "../../services/oportunidades/OpportunityKanbanService";
import { KanbanBoardName } from "../../utils/kanbanFlowRules";

interface OpportunityKanbanMovementTimelineProps {
  CODOS: number;
  board: KanbanBoardName;
  open: boolean;
}

const formatMovementDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Horário indisponível" : date.toLocaleString("pt-BR");
};

const OpportunityKanbanMovementTimeline = ({ CODOS, board, open }: OpportunityKanbanMovementTimelineProps) => {
  const dispatch = useDispatch();
  const [movements, setMovements] = useState<OpportunityKanbanMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open || !expanded || !CODOS) return;

    let active = true;
    setMovements([]);
    setHasError(false);
    setLoading(true);
    OpportunityKanbanService.getMovementHistory(CODOS, board)
      .then((data) => {
        if (active) setMovements(data);
      })
      .catch(() => {
        if (active) {
          setHasError(true);
          dispatch(setFeedback({ message: "Erro ao carregar o histórico de movimentações", type: "error" }));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [CODOS, board, dispatch, expanded, open]);

  return (
    <Accordion expanded={expanded} onChange={(_, nextExpanded) => setExpanded(nextExpanded)} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
          Histórico de movimentações
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}><CircularProgress size={24} /></Box>
        ) : hasError ? (
          <Typography variant="body2" color="text.secondary">Não foi possível carregar o histórico.</Typography>
        ) : movements.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Nenhuma movimentação registrada.</Typography>
        ) : (
          <Stack divider={<Divider flexItem />}>
            {movements.map((movement) => (
              <Box key={movement.id} sx={{ py: 1 }}>
                <Typography variant="body2">
                  <Box component="span" fontWeight="bold">{movement.coluna_origem_nome || "Início"}</Box>
                  {" → "}
                  <Box component="span" fontWeight="bold">{movement.coluna_destino_nome}</Box>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {movement.usuario_nome || "Sistema"} · {formatMovementDate(movement.movimentado_em)} · {movement.quadro}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default OpportunityKanbanMovementTimeline;
