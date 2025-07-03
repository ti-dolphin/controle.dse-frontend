import React from "react";
import { RequisitionStatus } from "../../models/requisicoes/RequisitionStatus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRequisitionStatus } from "../../hooks/requisicoes/RequisitionStatusHook";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import RequisitionStatusService from "../../services/requisicoes/RequisitionStatusService";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { setRequisition } from "../../redux/slices/requisicoes/requisitionSlice";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useRequisitionStatusPermissions } from "../../hooks/requisicoes/RequisitionStatusPermissionHook";

interface RequisitionStatusStepperProps {
  id_requisicao: number;
}

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 1,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
  },
}));

const StepIconRoot = styled("div")<{
  ownerState: { active: boolean; completed: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    ownerState.completed || ownerState.active
      ? theme.palette.success.main
      : theme.palette.grey[400],
  zIndex: 1,
  color: "#fff",
  width: 24,
  height: 24,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: 700,
  fontSize: 14,
  border: ownerState.active
    ? `2px solid ${theme.palette.success.main}`
    : "none",
}));

function CustomStepIcon(props: any) {
  const { active, completed, className, icon } = props;
  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <CheckIcon fontSize="small" /> : icon}
    </StepIconRoot>
  );
}

const RequisitionStatusStepper = ({
  id_requisicao,
}: RequisitionStatusStepperProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const { requisition } = useSelector((state: RootState) => state.requisition);
  const { permissionToChangeStatus } = useRequisitionStatusPermissions(user, requisition);

  const currentStatusIndex = requisition.status?.etapa ?? 0;
  const { statusList, canceledStatus } = useRequisitionStatus();

  const handleChangeStatus = async (
    type: "acao_anterior" | "acao_posterior"
  ) => {
    console.log("permiSsionToChangeStatus: ", permissionToChangeStatus)
    if(!permissionToChangeStatus){ 
        dispatch(setFeedback({ 
            type: 'error', 
            message: 'Você não tem permissão para alterar o status.' 
        }));
        return;
    }
    try {
      const currentStep = requisition.status?.etapa ?? 0;
      const nextStep =
        type === "acao_posterior"
          ? currentStep + 1
          : type === "acao_anterior"
          ? currentStep - 1
          : currentStep;
      const newStatus = statusList.find((status) => status.etapa === nextStep);

      if (!newStatus) {
        dispatch(
          setFeedback({
            type: "error",
            message: "Não foi possível alterar o status.",
          })
        );
        return;
      }

      const updatedRequisition = await RequisitionService.update(
        Number(id_requisicao),
        { id_status_requisicao: newStatus.id_status_requisicao }
      );

      dispatch(setRequisition(updatedRequisition));
      dispatch(
        setFeedback({
          type: "success",
          message: "Status atualizado com sucesso!",
        })
      );
    } catch (e: any) {
      dispatch(
        setFeedback({
          type: "error",
          message: `Erro ao atualizar status: ${e.message}`,
        })
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        pb: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Stepper
        alternativeLabel
        activeStep={currentStatusIndex}
        connector={<CustomConnector />}
        sx={{ minWidth: 600 }}
      >
        {statusList.map((status, idx) => (
          <Step key={status.id_status_requisicao}>
            <StepLabel
              StepIconComponent={CustomStepIcon}
              sx={{
                "& .MuiStepLabel-label": {
                  mt: 1,
                  fontWeight: idx === currentStatusIndex ? 700 : 400,
                  color:
                    idx === currentStatusIndex
                      ? "text.primary"
                      : "text.secondary",
                },
              }}
            >
              <Typography
                fontWeight={idx === currentStatusIndex ? 700 : 400}
                color={
                  idx === currentStatusIndex ? "text.primary" : "text.secondary"
                }
                sx={{
                  textTransform: "none",
                  fontSize: idx === currentStatusIndex ? 14 : 14,
                  textAlign: "center",
                }}
              >
                {status.nome}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stack direction="row" justifyContent="center" sx={{ gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleChangeStatus("acao_anterior")}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textTransform: "capitalize",
            borderRadius: 2,
            maxWidth: 200,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ArrowCircleLeftIcon sx={{ mr: 1 }} />
          <Typography fontSize="small">
            {requisition.status?.acao_anterior}
          </Typography>
        </Button>
        <Button
          variant="contained"
          onClick={() => handleChangeStatus("acao_posterior")}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textTransform: "capitalize",
            borderRadius: 2,
            maxWidth: 200,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography fontSize="small">
            {requisition.status?.acao_posterior}
          </Typography>
          <ArrowCircleRightIcon sx={{ mr: 1 }} />
        </Button>
      </Stack>
    </Box>
  );
};

export default RequisitionStatusStepper;
