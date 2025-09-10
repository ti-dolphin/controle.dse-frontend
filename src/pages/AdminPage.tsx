import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import OpportunityService from "../services/oportunidades/OpportunityService";
import { useDispatch } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { CheckListService } from "../services/patrimonios/ChecklistService";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import UpperNavigation from "../components/shared/UpperNavigation";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingReport, setLoadingReport] = React.useState(false);
  const [loadingChecklists, setLoadingChecklists] = React.useState(false);
  const [loadingItems, setLoadingItems] = React.useState(false);

  const [repportInfo, setRepportInfo] = React.useState<{
    succesfullEmails: number;
    failedEmails: number;
  } | null>(null);

  const [checklistVerificationInfo, setChecklistVerificationInfo] =
    React.useState<{
      checklistsCreated: number;
      errors: number;
    } | null>(null);

  const [checklistItemsInfo, setChecklistItemsInfo] = React.useState<{
    checklistWithItemsInserted: number;
  } | null>(null);

  const [checklistEmailsInfo, setchecklistEmailsInfo] = React.useState<{
    emailsSent: number;
  } | null>(null);

  const handleBack = () => {
    navigate('/')
  };

  const verifyReport = async () => {
    setLoadingReport(true);
    try {
      const data = await OpportunityService.getReportInfo();
      setRepportInfo(data);
    } catch (e) {
      dispatch(
        setFeedback({ message: "Erro ao verificar relatório", type: "error" })
      );
    } finally {
      setLoadingReport(false);
    }
  };

  const verifyChecklists = async () => {
    setLoadingChecklists(true);
    try {
      const data = await CheckListService.verifyChecklistCreation();
      setChecklistVerificationInfo(data);
    } catch (e) {
      dispatch(
        setFeedback({ message: "Erro ao verificar checklists", type: "error" })
      );
    } finally {
      setLoadingChecklists(false);
    }
  };

  const verifyChecklistItems = async () => {
    setLoadingItems(true);
    try {
      const data = await CheckListService.verifyChecklistItems();
      setChecklistItemsInfo(data);
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Erro ao verificar itens do checklist",
          type: "error",
        })
      );
    } finally {
      setLoadingItems(false);
    }
  };

  const verifyChecklistEmails = async () => {
    setLoadingItems(true);
    try {
      const data = await CheckListService.verifyChecklistEmails();

      setchecklistEmailsInfo(data);
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Erro ao verificar emails do checklist",
          type: "error",
        })
      );
    } finally {
      setLoadingItems(false);
    }
  };

  const cardStyle = {
    borderRadius: 3,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
    minHeight: 150,
  };

  return (
    <Box sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <UpperNavigation handleBack={handleBack} />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Painel Administrativo
        </Typography>
        <Grid container spacing={3}>
          {/* Relatório semanal */}
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <EmailIcon color="primary" fontSize="large" />
                  <Typography variant="h6">
                    Relatório Semanal das Propostas
                  </Typography>
                </Stack>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={verifyReport}
                    disabled={loadingReport}
                  >
                    {loadingReport ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Verificar"
                    )}
                  </Button>
                </Box>
                {repportInfo && (
                  <Box mt={2}>
                    <Typography color="text.secondary">
                      Emails enviados: {repportInfo.succesfullEmails}
                    </Typography>
                    <Typography color="text.secondary">
                      Erros: {repportInfo.failedEmails}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Checklists criados */}
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AssignmentTurnedInIcon color="success" fontSize="large" />
                  <Typography variant="h6">Criação de Checklists</Typography>
                </Stack>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={verifyChecklists}
                    disabled={loadingChecklists}
                  >
                    {loadingChecklists ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Verificar"
                    )}
                  </Button>
                </Box>
                {checklistVerificationInfo && (
                  <Box mt={2}>
                    <Typography color="text.secondary">
                      checklists criados:{" "}
                      {checklistVerificationInfo.checklistsCreated}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Itens do checklist */}
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircleIcon color="info" fontSize="large" />
                  <Typography variant="h6">Itens do Checklist</Typography>
                </Stack>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    onClick={verifyChecklistItems}
                    disabled={loadingItems}
                  >
                    {loadingItems ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Verificar"
                    )}
                  </Button>
                </Box>
                {checklistItemsInfo && (
                  <Box mt={2}>
                    <Typography color="text.secondary">
                      checklists com itens inseridos:{" "}
                      {checklistItemsInfo.checklistWithItemsInserted}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Emails do checklist */}
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <EmailIcon color="info" fontSize="large" />
                  <Typography variant="h6">Email dos checklists</Typography>
                </Stack>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    onClick={verifyChecklistEmails}
                    disabled={loadingItems}
                  >
                    {loadingItems ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Verificar"
                    )}
                  </Button>
                </Box>
                {checklistEmailsInfo && (
                  <Box mt={2}>
                    <Typography color="text.secondary">
                      Emails do checklist enviados{" "}
                      {checklistEmailsInfo?.emailsSent}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminPage;
