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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { setRequisition } from "../../redux/slices/requisicoes/requisitionSlice";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useRequisitionStatusPermissions } from "../../hooks/requisicoes/RequisitionStatusPermissionHook";
import { RequisitionStatus } from "../../models/requisicoes/RequisitionStatus";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
import { gridColumnLookupSelector } from "@mui/x-data-grid";
import { setRefresh } from "../../redux/slices/requisicoes/requisitionItemSlice";
import QuoteService from "../../services/requisicoes/QuoteService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ElegantInput from "../shared/ui/Input";
import RequisitionCommentService from "../../services/requisicoes/RequisitionCommentService";
import { addComment } from "../../redux/slices/requisicoes/requisitionCommentSlice";

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
  const navigate = useNavigate();
  const { requisition } = useSelector((state: RootState) => state.requisition);
  const { permissionToChangeStatus, permissionToCancel, permissionToActivate } = useRequisitionStatusPermissions(user, requisition);
  const currentStatusIndex = requisition.status?.etapa ?? 0;
  const { statusList } = useRequisitionStatus(id_requisicao); 
  const {refresh} = useSelector((state: RootState) => state.requisitionItem);
  const [fillingComment, setFillingComment] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');


  const validationRules = async (newStatus: RequisitionStatus ) =>  {
      if(newStatus.nome === 'Validação') {
        const items = await RequisitionItemService.getMany({id_requisicao});
        const noItems = items.length === 0; 
        if(noItems) {
          throw new Error('Requisição sem itens');
        } 
      }
      if(newStatus.nome === 'Aprovação Gerente'){ 
        const quotes = await QuoteService.getMany({id_requisicao});
        const noQuotes = quotes.length === 0;
        if(noQuotes) {
          throw new Error('Requisição sem cotações');
        }
      }
      return;
  } 

  const handleChangeStatus = async (
    type: "acao_anterior" | "acao_posterior"
  ) => {
    if(!permissionToChangeStatus){ 
        dispatch(setFeedback({ 
            type: 'error', 
            message: 'Você não tem permissão para alterar o status.' 
        }));
        return;
    }
    if (type === "acao_anterior" && permissionToChangeStatus) {
      setFillingComment(true);
      return;
    }
    try {
      const currentStep = requisition.status?.etapa ?? 0;
      const nextStep = type === "acao_posterior"
          ? currentStep + 1
          : type === "acao_anterior"
          ? currentStep - 1
          : currentStep;
        
      const newStatus = statusList.find((status) => status.etapa === nextStep); //FINDS THE CORRESPONDING  NEW STATUS
      if(newStatus){ 
        await validationRules(newStatus);
      }
      if (!newStatus) {
        dispatch(
          setFeedback({
            type: "error",
            message: "Não foi possível alterar o status.",
          })
        );
        return;
      }
      const updatedRequisition = await RequisitionService.updateStatus( //SEND IT TO THE BACKEND!
        Number(id_requisicao),
        {
          id_status_requisicao: newStatus.id_status_requisicao,
          alterado_por: user?.CODPESSOA,
        }
      );
       dispatch(setRequisition(updatedRequisition));
       dispatch(setRefresh(!refresh));
      if(!permissionToChangeStatus){ 
        navigate("/requisicoes");
        return;
      }
      dispatch(setRequisition(updatedRequisition));
      dispatch(setRefresh(!refresh));

      dispatch(
        setFeedback({
          type: "success", //DISPLAYS SUCCESS MESSAGE ON SCREEN
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

  const concludeRetreatRequisition = async () => {
    setFillingComment(false);
    setComment("");
    const createdComment = await RequisitionCommentService.create({
      id_requisicao: Number(id_requisicao),
      descricao: comment,
      criado_por: user?.CODPESSOA || 0,
    });
    if (createdComment) {
      dispatch(addComment(createdComment));
      const type = "acao_anterior";
      const currentStep = requisition.status?.etapa ?? 0;
      const nextStep = currentStep - 1;
      const newStatus = statusList.find((status) => status.etapa === nextStep); //FINDS THE CORRESPONDING  NEW STATUS
      if (newStatus) {
        await validationRules(newStatus);
      }
      if (!newStatus) {
        dispatch(
          setFeedback({
            type: "error",
            message: "Não foi possível alterar o status.",
          })
        );
        return;
      }
      const updatedRequisition = await RequisitionService.updateStatus(
        //SEND IT TO THE BACKEND!
        Number(id_requisicao),
        {
          id_status_requisicao: newStatus.id_status_requisicao,
          alterado_por: user?.CODPESSOA,
        }
      );
      dispatch(setRequisition(updatedRequisition));
      dispatch(setRefresh(!refresh));
      if (!permissionToChangeStatus) {
        navigate("/requisicoes");
        return;
      }
      dispatch(setRequisition(updatedRequisition));
      dispatch(setRefresh(!refresh));

      dispatch(
        setFeedback({
          type: "success", //DISPLAYS SUCCESS MESSAGE ON SCREEN
          message: "Status atualizado com sucesso!",
        })
      );
    }
  };

  const handleCancel = async ( ) =>  {
    try {
      const updatedRequisition = await RequisitionService.cancel(Number(id_requisicao));
      dispatch(setRequisition(updatedRequisition));
      dispatch(
        setFeedback({
          type: "success", //DISPLAYS SUCCESS MESSAGE ON SCREEN
          message: "Requisição cancelada com sucesso!",
        })
      );
    }catch(e : any){ 
      dispatch(
        setFeedback({
          type: "error",
          message: `Erro ao cancelar requisição: ${e.message}`,
        })
      );
    }
  }

  const handleActivate = async ( ) =>  {
    try {
      const updatedRequisition = await RequisitionService.activate(Number(id_requisicao));
      dispatch(setRequisition(updatedRequisition));
      dispatch(
        setFeedback({
          type: "success", //DISPLAYS SUCCESS MESSAGE ON SCREEN
          message: "Requisição ativada com sucesso!",
        })
      );
    }catch(e : any){ 
      dispatch(
        setFeedback({
          type: "error",
          message: `Erro ao ativar requisição: ${e.message}`,
        })
      );
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {requisition.status?.nome !== "Cancelado" && (
        <Stepper
          alternativeLabel
          activeStep={currentStatusIndex}
          connector={<CustomConnector />}
          sx={{
            // minWidth: 600,
            // p: 0,
            // m: 0,
            // "& .MuiStepLabel-label": {
            //   mt: 0.5, // reduz espaço entre ícone e texto
            //   fontSize: 12,
            //   fontWeight: 500,
            // },
            padding: {
              xs: 2,
              sm: 0,
            },
            minWidth: { xs: "100%", sm: 600 }, // ocupa toda largura em mobile
            flexWrap: "nowrap",
            overflowX: "auto",
            "& .MuiStepLabel-label": {
              mt: 0.5,
              fontSize: { xs: 10, sm: 12 }, // menor fonte no mobile
              fontWeight: 500,
            },
          }}
        >
          {statusList.map((status, idx) => (
            <Step key={status.id_status_requisicao}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography
                  fontSize={{ xs: 10, sm: 12 }}
                  fontWeight={idx === currentStatusIndex ? 600 : 400}
                  color={
                    idx === currentStatusIndex
                      ? "text.primary"
                      : "text.secondary"
                  }
                  sx={{ textAlign: "center", whiteSpace: "nowrap" }}
                >
                  {status.nome}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      <Stack direction="row" justifyContent="center" spacing={1}>
        <Button
          size="small"
          variant="contained"
          onClick={() => handleChangeStatus("acao_anterior")}
          sx={{ minHeight: 28, px: { xs: 0.5, sm: 1 } }}
        >
          <ArrowCircleLeftIcon fontSize="small" />
          <Typography fontSize={12}>
            {requisition.status?.acao_anterior}
          </Typography>
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => handleChangeStatus("acao_posterior")}
          sx={{ minHeight: 28, px: { xs: 0.5, sm: 1 } }}
        >
          <Typography fontSize={12}>
            {requisition.status?.acao_posterior}
          </Typography>
          <ArrowCircleRightIcon fontSize="small" />
        </Button>
        {permissionToCancel && (
          <Button
            size="small"
            variant="contained"
            color="error"
            sx={{ minHeight: 28 }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        )}
        {permissionToActivate && (
          <Button
            size="small"
            variant="contained"
            color="success"
            sx={{ minHeight: 28 }}
            onClick={handleActivate}
          >
            Reativar
          </Button>
        )}
      </Stack>
      <Dialog open={fillingComment}>
        <DialogTitle>
          Justifique o retorno da requisição para etapa anterior
        </DialogTitle>
        <DialogContent>
          <ElegantInput
            label="Justificação"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => setFillingComment(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="small"
             color="success"
            onClick={() => concludeRetreatRequisition()}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequisitionStatusStepper;
