
import { useEffect, useState } from "react";
import { Requisition } from "../../models/requisicoes/Requisition";
import { User } from "../../models/User";

export const useRequisitionItemPermissions = (user : User | null, requisition : Requisition) =>  {
    const [editItemFieldsPermitted, setEditItemFieldsPermitted] = useState<boolean>(false);
    const [changeProductItemPermitted, setChangeProductItemPermitted] = useState<boolean>(false);
    const [createQuotePermitted, setCreateQuotePermitted] = useState<boolean>(false);

    useEffect(() => {
      const adm = Number(user?.PERM_ADMINISTRADOR) == 1; 
      const responsable = Number(user?.CODPESSOA) == Number(requisition.ID_RESPONSAVEL) && requisition.status?.nome === "Em edição";  

      const editionEnabledForStatus = ['requisitado', 'em cotação' ];
      const buyer = Number(user?.PERM_COMPRADOR) == 1 && editionEnabledForStatus.includes(requisition.status?.nome  ? requisition.status?.nome.toLowerCase() : ''); 
      console.log("buyer", buyer);
      setEditItemFieldsPermitted(adm || responsable || buyer);
      setChangeProductItemPermitted(adm || responsable || buyer);
      setCreateQuotePermitted((adm || buyer) && requisition.status?.nome === "Em cotação");
    }, [user, requisition]);

    return {
      editItemFieldsPermitted,
      changeProductItemPermitted,
      createQuotePermitted,
    };
};