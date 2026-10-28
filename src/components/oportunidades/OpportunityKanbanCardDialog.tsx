import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography, Divider, Box, Tooltip, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { OpportunityKanbanCardDialogProps } from "../../models/oportunidades/Opportunity";
import OpportunityService from "../../services/oportunidades/OpportunityService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { formatDateStringtoISOstring, getDateInputValue } from "../../utils";
import OpportunityFollowerList from "./OpportunityFollowerList";
import OpportunityChecklistSection from "./OpportunityChecklistSection";
import OpportunityAlinhamentoList from "./OpportunityAlinhamentoList";
import OpportunityPendenciasList from "./OpportunityPendenciasList";
import OpportunityKanbanMovementTimeline from "./OpportunityKanbanMovementTimeline";
import { formatCardTitle } from "../../utils/oportunidades/formatCardTitle";
import OpportunityKanbanService, { OpportunityReview } from "../../services/oportunidades/OpportunityKanbanService";

const OpportunityKanbanCardDialog = ({ open, board, opportunity, onClose }: OpportunityKanbanCardDialogProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataPlanejada, setDataPlanejada] = useState(getDateInputValue(opportunity?.data_planejada));
  const [followerRevision, setFollowerRevision] = useState(0);
  const [reviews, setReviews] = useState<OpportunityReview[]>([])

  useEffect(() => {

    async function fetchReviewData() {
      const codos = Number(opportunity?.CODOS)
      if (!codos) {
        setReviews([])
        return
      }
      try {
        const data = await OpportunityKanbanService.getReviewsByCodos(codos)
        setReviews(data)
      } catch {
        setReviews([])
        dispatch(setFeedback({ message: "Erro ao carregar revisões da oportunidade", type: "error" }))
      }
    }
    void fetchReviewData()
  }, [opportunity?.CODOS, dispatch])

  useEffect(() => {
    setDataPlanejada(getDateInputValue(opportunity?.data_planejada));
  }, [opportunity?.CODOS, opportunity?.data_planejada]);

  if (!opportunity) return null;

  const handleChangeDataPlanejada = async (value: string) => {
    setDataPlanejada(value);
    try {
      await OpportunityService.update(opportunity.CODOS, {
        data_planejada: value ? formatDateStringtoISOstring(value) : null,
      });
    } catch {
      dispatch(setFeedback({ message: "Erro ao salvar data planejada", type: "error" }));
    }
  };

  const handleReviewDateChange = async (
    review: OpportunityReview,
    field: "data_revisao" | "data_envio_inicial",
    value: string,
  ) => {
    const dateValue = value || null;
    setReviews((current) => current.map((item) => item.id === review.id ? { ...item, [field]: dateValue } : item));
    try {
      const updated = await OpportunityKanbanService.updateReviewDates(opportunity.CODOS, review.id, { [field]: dateValue });
      setReviews((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch {
      dispatch(setFeedback({ message: "Erro ao salvar datas da revisão", type: "error" }));
      try {
        const refreshed = await OpportunityKanbanService.getReviewsByCodos(opportunity.CODOS);
        setReviews(refreshed);
      } catch {
        // Mantém o valor local caso a atualização e a recarga falhem.
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ pr: 10 }}>
        <Typography component="div" variant="subtitle1" color="primary.main" fontWeight="bold">
          {formatCardTitle(opportunity)}
        </Typography>
        <Tooltip title="Ver detalhe da oportunidade">
          <IconButton
            onClick={() => navigate(`/oportunidades/${opportunity.CODOS}`)}
            sx={{ position: "absolute", top: 8, right: 48 }}
          >
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack gap={3}>
          <TextField
            label="Data planejada"
            type="date"
            size="small"
            value={dataPlanejada}
            onChange={(e) => handleChangeDataPlanejada(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 200 }}
          />

          {reviews.length > 0 && (
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">Revisões ({reviews.length})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack gap={2}>
                  {reviews.map((review) => (
                    <Box key={review.id}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Revisão {review.numeroRevisao}</Typography>
                      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                        <TextField
                          label="Data da revisão"
                          type="date"
                          size="small"
                          value={getDateInputValue(review.data_revisao)}
                          onChange={(event) => void handleReviewDateChange(review, "data_revisao", event.target.value)}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                        <TextField
                          label="Data de envio inicial"
                          type="date"
                          size="small"
                          value={getDateInputValue(review.data_envio_inicial)}
                          onChange={(event) => void handleReviewDateChange(review, "data_envio_inicial", event.target.value)}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}

          <OpportunityFollowerList CODOS={opportunity.CODOS} onChange={() => setFollowerRevision((current) => current + 1)} />

          <Divider />

          <OpportunityAlinhamentoList CODOS={opportunity.CODOS} />

          <Divider />

          <OpportunityPendenciasList CODOS={opportunity.CODOS} />

          <Divider />

          <Box>
            <OpportunityChecklistSection key={followerRevision} CODOS={opportunity.CODOS} showStatusDots={board === "Orçamento"} />
          </Box>

          <Divider />

          <OpportunityKanbanMovementTimeline CODOS={opportunity.CODOS} board={board} open={open} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityKanbanCardDialog;
