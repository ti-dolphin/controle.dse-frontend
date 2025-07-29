import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import OpportunityDetailedForm from "../../components/oportunidades/OpportunityDetailedForm";
import OpportunityCommentList from "../../components/oportunidades/OpportunityCommentList";
import OpportunityAttachmentList from "../../components/oportunidades/OpportunityAttachmentList";
import UpperNavigation from "../../components/shared/UpperNavigation";
import { useNavigate, useParams } from "react-router-dom";
import OpportunityFollowerList from "../../components/oportunidades/OpportunityFollowerList";

const OpportunityDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { CODOS } = useParams();
  const handleBack = () => {
    navigate("/oportunidades");
  };
  return (
    <Box
      sx={{
        p: { xs: 1, sm: 1 },
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <UpperNavigation handleBack={handleBack} />
      <Grid container direction="row" gap={1} wrap="wrap">
        {/* Seção de Campos de Cadastro */}
        <OpportunityDetailedForm />

        <Grid
          container
          direction={{ xs: "column", md: "row" }}
          gap={1}
          wrap="nowrap"
        >
          {/* Seção de Comentários */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 1, height: '100%' }}>
              <OpportunityCommentList />

              {/* Lista de comentários */}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 1, height: "100%" }}>
              {/* Lista de seguidores */}
              <Box sx={{ minHeight: 100 }}>
                <OpportunityFollowerList CODOS={Number(CODOS)} />
              </Box>
            </Paper>
          </Grid>

          {/* Seção de Anexos */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 1, height: "100%" }}>
              {/* Lista de anexos */}
              <Box sx={{ minHeight: 100 }}>
                <OpportunityAttachmentList />
              </Box>
            </Paper>
          </Grid>

          {/* Seção de Seguidores */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default OpportunityDetailPage;
