import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDispatch, useSelector } from "react-redux";
import { useRequisitionStatus } from "../../hooks/requisicoes/RequisitionStatusHook";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, styled, Box, Typography, Stack, Button, } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { setRequisition } from "../../redux/slices/requisicoes/requisitionSlice";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useRequisitionStatusPermissions } from "../../hooks/requisicoes/RequisitionStatusPermissionHook";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
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
const StepIconRoot = styled("div")(({ theme, ownerState }) => ({
    backgroundColor: ownerState.completed || ownerState.active
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
function CustomStepIcon(props) {
    const { active, completed, className, icon } = props;
    return (_jsx(StepIconRoot, { ownerState: { completed, active }, className: className, children: completed ? _jsx(CheckIcon, { fontSize: "small" }) : icon }));
}
const RequisitionStatusStepper = ({ id_requisicao, }) => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const { requisition } = useSelector((state) => state.requisition);
    const { permissionToChangeStatus, permissionToCancel, permissionToActivate } = useRequisitionStatusPermissions(user, requisition);
    const currentStatusIndex = requisition.status?.etapa ?? 0;
    const { statusList } = useRequisitionStatus();
    const validationRules = async (newStatus) => {
        if (newStatus.nome === 'Validação') {
            const items = await RequisitionItemService.getMany({ id_requisicao });
            const noItems = items.length === 0;
            if (noItems) {
                throw new Error('Requisição sem itens');
            }
        }
        return;
    };
    const handleChangeStatus = async (type) => {
        if (!permissionToChangeStatus) {
            dispatch(setFeedback({
                type: 'error',
                message: 'Você não tem permissão para alterar o status.'
            }));
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
            if (newStatus) {
                await validationRules(newStatus);
            }
            if (!newStatus) {
                dispatch(setFeedback({
                    type: "error",
                    message: "Não foi possível alterar o status.",
                }));
                return;
            }
            const updatedRequisition = await RequisitionService.update(//SEND IT TO THE BACKEND!
            Number(id_requisicao), {
                id_status_requisicao: newStatus.id_status_requisicao,
                alterado_por: user?.CODPESSOA,
            });
            dispatch(setRequisition(updatedRequisition));
            dispatch(setFeedback({
                type: "success", //DISPLAYS SUCCESS MESSAGE ON SCREEN
                message: "Status atualizado com sucesso!",
            }));
        }
        catch (e) {
            dispatch(setFeedback({
                type: "error",
                message: `Erro ao atualizar status: ${e.message}`,
            }));
        }
    };
    const handleCancel = async () => {
        try {
            const updatedRequisition = await RequisitionService.cancel(Number(id_requisicao));
            dispatch(setRequisition(updatedRequisition));
            dispatch(setFeedback({
                type: "success", //DISPLAYS SUCCESS MESSAGE ON SCREEN
                message: "Requisição cancelada com sucesso!",
            }));
        }
        catch (e) {
            dispatch(setFeedback({
                type: "error",
                message: `Erro ao cancelar requisição: ${e.message}`,
            }));
        }
    };
    const handleActivate = async () => {
        try {
            const updatedRequisition = await RequisitionService.activate(Number(id_requisicao));
            dispatch(setRequisition(updatedRequisition));
            dispatch(setFeedback({
                type: "success", //DISPLAYS SUCCESS MESSAGE ON SCREEN
                message: "Requisição ativada com sucesso!",
            }));
        }
        catch (e) {
            dispatch(setFeedback({
                type: "error",
                message: `Erro ao ativar requisição: ${e.message}`,
            }));
        }
    };
    return (_jsxs(Box, { sx: {
            width: "100%",
            overflowX: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }, children: [requisition.status?.nome !== "Cancelado" && (_jsx(Stepper, { alternativeLabel: true, activeStep: currentStatusIndex, connector: _jsx(CustomConnector, {}), sx: {
                    minWidth: 600,
                    p: 0,
                    m: 0,
                    "& .MuiStepLabel-label": {
                        mt: 0.5, // reduz espaço entre ícone e texto
                        fontSize: 12,
                        fontWeight: 500,
                    },
                }, children: statusList.map((status, idx) => (_jsx(Step, { children: _jsx(StepLabel, { StepIconComponent: CustomStepIcon, children: _jsx(Typography, { fontSize: 12, fontWeight: idx === currentStatusIndex ? 600 : 400, color: idx === currentStatusIndex
                                ? "text.primary"
                                : "text.secondary", sx: { textAlign: "center", whiteSpace: "nowrap" }, children: status.nome }) }) }, status.id_status_requisicao))) })), _jsxs(Stack, { direction: "row", justifyContent: "center", spacing: 1, children: [_jsxs(Button, { size: "small", variant: "contained", onClick: () => handleChangeStatus("acao_anterior"), sx: { minHeight: 28, px: 1 }, children: [_jsx(ArrowCircleLeftIcon, { fontSize: "small" }), _jsx(Typography, { fontSize: 12, children: requisition.status?.acao_anterior })] }), _jsxs(Button, { size: "small", variant: "contained", onClick: () => handleChangeStatus("acao_posterior"), sx: { minHeight: 28, px: 1 }, children: [_jsx(Typography, { fontSize: 12, children: requisition.status?.acao_posterior }), _jsx(ArrowCircleRightIcon, { fontSize: "small" })] }), permissionToCancel && (_jsx(Button, { size: "small", variant: "contained", color: "error", sx: { minHeight: 28 }, onClick: handleCancel, children: "Cancelar" })), permissionToActivate && (_jsx(Button, { size: "small", variant: "contained", color: "success", sx: { minHeight: 28 }, onClick: handleActivate, children: "Reativar" }))] })] }));
};
export default RequisitionStatusStepper;
