import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { SimilarOpportunity } from "../../services/oportunidades/OpportunityService";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  p: 3,
  borderRadius: 2,
  minWidth: {
    xs: 320,
    sm: 500,
  },
  maxWidth: 600,
  maxHeight: "80vh",
  zIndex: 1400, // Acima do modal de formulário
};

interface SimilarOpportunitiesModalProps {
  open: boolean;
  opportunities: SimilarOpportunity[];
  onClose: () => void;
  onCreateNew: () => void;
  onLinkTo: (codos: number) => void;
}

const SimilarOpportunitiesModal: React.FC<SimilarOpportunitiesModalProps> = ({
  open,
  opportunities,
  onClose,
  onCreateNew,
  onLinkTo,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon color="error" />
        </IconButton>

        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <WarningAmberIcon color="warning" />
          <Typography variant="h6" fontWeight={600} color="warning.main">
            Propostas Semelhantes Encontradas
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Foram encontradas propostas semelhantes neste projeto. Você pode
          vincular a nova proposta a uma existente (não contará nos totais) ou
          criar uma nova proposta independente.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ overflow: "auto", maxHeight: 300, mb: 2 }}>
          <List dense>
            {opportunities.map((opp) => (
              <ListItem
                key={opp.CODOS}
                disablePadding
                secondaryAction={
                  <Stack direction="row" spacing={1} alignItems="center">
                    {opp.isVinculada && (
                      <Chip
                        size="small"
                        icon={<LinkIcon />}
                        label="Vinculada"
                        color="info"
                        variant="outlined"
                      />
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => onLinkTo(opp.CODOS)}
                      startIcon={<LinkIcon />}
                    >
                      Vincular
                    </Button>
                  </Stack>
                }
              >
                <ListItemButton sx={{ pr: 20 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {opp.NOME}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Typography variant="caption" color="text.secondary">
                          Adicional {opp.numeroAdicional}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {formatDate(opp.DATASOLICITACAO)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {opp.status}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {opp.cliente}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="text" color="inherit" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={onCreateNew}>
            Criar Nova Proposta
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default SimilarOpportunitiesModal;
