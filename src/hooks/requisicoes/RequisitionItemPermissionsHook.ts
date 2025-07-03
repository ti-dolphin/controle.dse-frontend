
import { useEffect } from "react";
import { Requisition } from "../../models/requisicoes/Requisition";
import { User } from "../../models/User";

export const useRequisitionItemPermissions = (user : User | null, requisition : Requisition) =>  {
    const adm = Number(user?.PERM_ADMINISTRADOR) == 1 
    const responsable = Number(user?.CODPESSOA) == Number(requisition.ID_RESPONSAVEL);   
    const editItemFieldsPermitted = adm || responsable
    const changeProductItemPermitted = adm || responsable;

    return {
      editItemFieldsPermitted,
      changeProductItemPermitted,
    };
};