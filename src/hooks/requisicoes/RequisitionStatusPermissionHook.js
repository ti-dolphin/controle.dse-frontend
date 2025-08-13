import { useCallback, useEffect, useState } from "react";
import RequisitionStatusService from "../../services/requisicoes/RequisitionStatusService";
import { useDispatch } from "react-redux";
import { setFeedback } from "../../redux/slices/feedBackSlice";
export const useRequisitionStatusPermissions = (user, requisition) => {
    const dispatch = useDispatch();
    const [permissionToChangeStatus, setPermissionToChangeStatus] = useState(false);
    const [permissionToCancel, setPermissionToCancel] = useState(false);
    const [permissionToActivate, setPermissionToActivate] = useState(false);
    const fetchPermission = useCallback(async () => {
        setPermissionToCancel(false);
        setPermissionToActivate(false);
        setPermissionToChangeStatus(false);
        const admOrBuyer = user?.PERM_ADMINISTRADOR === 1 || user?.PERM_COMPRADOR === 1;
        const notCancelled = requisition.status?.nome !== "Cancelado";
        const cancelled = requisition.status?.nome === "Cancelado";
        if (admOrBuyer && cancelled) {
            setPermissionToActivate(true);
        }
        if (admOrBuyer && notCancelled) {
            setPermissionToCancel(true);
        }
        if (user && requisition.ID_REQUISICAO > 0) {
            setPermissionToChangeStatus(false);
            try {
                const permissions = await RequisitionStatusService.getStatusPermissions(user, requisition);
                setPermissionToChangeStatus(permissions.permissionToChangeStatus);
            }
            catch (error) {
                dispatch(setFeedback({
                    message: `Erro ao verificar permissões no status: ${error.message} `,
                    type: "error",
                }));
            }
        }
    }, [user, requisition]);
    //useEffect
    useEffect(() => {
        fetchPermission();
    }, [fetchPermission]);
    return {
        permissionToChangeStatus,
        permissionToCancel,
        permissionToActivate,
    };
};
