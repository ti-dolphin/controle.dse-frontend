import { useCallback, useEffect, useState } from "react";
import { Requisition } from "../../models/requisicoes/Requisition";
import { User } from "../../models/User";
import RequisitionStatusService from "../../services/requisicoes/RequisitionStatusService";
import { useDispatch } from "react-redux";
import { setFeedback } from "../../redux/slices/feedBackSlice";

export interface RequisitionStatusPermissions{ 
    permissionToChangeStatus: boolean;
}


export const useRequisitionStatusPermissions = (user: User | null, requisition: Requisition ) => { 
    const dispatch = useDispatch();
    const [permissionToChangeStatus, setPermissionToChangeStatus] = useState<boolean>(false);
    const [permissionToCancel, setPermissionToCancel] = useState<boolean>(false);

    const fetchPermission = useCallback(async () => { 
    const admOrBuyer = user?.PERM_ADMINISTRADOR === 1 || user?.PERM_COMPRADOR === 1;
    if (admOrBuyer) {
      setPermissionToCancel(true);
      return;
    }
    if (user && requisition.ID_REQUISICAO > 0) {
      setPermissionToChangeStatus(false)
      try {
        const permissions = await RequisitionStatusService.getStatusPermissions(
        user,
        requisition
        );
   
        setPermissionToChangeStatus(permissions.permissionToChangeStatus);
      } catch (error: any) {
        dispatch(
        setFeedback({
          message: `Erro ao verificar permissões no status: ${error.message} `,
          type: "error",
        })
        );
      }
    }
    }, [user, requisition]);

    //useEffect
    useEffect(() => { 
        fetchPermission();
    }, [fetchPermission]);

    return { permissionToChangeStatus };

};


