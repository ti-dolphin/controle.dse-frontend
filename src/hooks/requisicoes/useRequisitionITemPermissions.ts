
// import { useEffect, useState } from "react";
// import { Requisition } from "../../models/requisicoes/Requisition";
// import { User } from "../../models/User";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";

// export const useRequisitionItemPermissions = (user : User | null, requisition : Requisition) =>  {
//     const [editItemFieldsPermitted, setEditItemFieldsPermitted] = useState<boolean>(false);
//     const [changeProductItemPermitted, setChangeProductItemPermitted] = useState<boolean>(false);
//     const [createQuotePermitted, setCreateQuotePermitted] = useState<boolean>(false);
//     const attendingItems = useSelector(
//       (state: RootState) => state.attendingItemsSlice.attendingItems
//     );

//     useEffect(() => {
//       const adm = Number(user?.PERM_ADMINISTRADOR) == 1; 
//       const responsable = Number(user?.CODPESSOA) == Number(requisition.ID_RESPONSAVEL) && requisition.status?.nome === "Em edição";  
//       const editionEnabledForStatus = ['requisitado', 'em cotação' ];
//       const buyer = Number(user?.PERM_COMPRADOR) == 1 && editionEnabledForStatus.includes(requisition.status?.nome  ? requisition.status?.nome.toLowerCase() : '');
      
      
//       setEditItemFieldsPermitted(adm || responsable || buyer);
//       setChangeProductItemPermitted(adm || responsable || buyer);
//       setCreateQuotePermitted((adm || buyer) && requisition.status?.nome === "Em cotação");
//     }, [user, requisition]);

//     return {
//       editItemFieldsPermitted,
//       changeProductItemPermitted,
//       createQuotePermitted,
//     };
// };

import { useEffect, useState } from "react";
import { Requisition } from "../../models/requisicoes/Requisition";
import { User } from "../../models/User";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const editionEnabledStatuses = ["requisitado", "em cotação", "separar estoque"];

function isAdmin(user: User | null): boolean {
  return Number(user?.PERM_ADMINISTRADOR) === 1;
}

function isResponsable(user: User | null, requisition: Requisition): boolean {
  return (
    Number(user?.CODPESSOA) === Number(requisition.ID_RESPONSAVEL) &&
    requisition.status?.nome?.toLowerCase() === "em edição"
  );
}

function isBuyer(user: User | null, requisition: Requisition): boolean {
  const status = requisition.status?.nome?.toLowerCase() || "";
  return (
    Number(user?.PERM_COMPRADOR) === 1 &&
    editionEnabledStatuses.includes(status)
  );
}

function isStockUser (user: User | null, requisition: Requisition): boolean {
  const status = requisition.status?.nome?.toLowerCase() || "";
  return (
    Number(user?.PERM_ESTOQUE) === 1 && 
    editionEnabledStatuses.includes(status)
  )
}

export const useRequisitionItemPermissions = (
  user: User | null,
  requisition: Requisition
) => {
  const [editItemFieldsPermitted, setEditItemFieldsPermitted] = useState(false);
  const [changeProductItemPermitted, setChangeProductItemPermitted] = useState(false);
  const [createQuotePermitted, setCreateQuotePermitted] = useState(false);
  useSelector((state: RootState) => state.attendingItemsSlice.attendingItems); // Mantido caso precise do valor

  useEffect(() => {
    const admin = isAdmin(user);
    const responsable = isResponsable(user, requisition);
    const buyer = isBuyer(user, requisition);
    const status = requisition.status?.nome?.toLowerCase() || "";
    const stockUser = isStockUser(user, requisition);


    console.log("status", status);
    console.log("responsable", responsable);
    console.log("admin", admin);
    console.log("buyer", buyer);

    setEditItemFieldsPermitted(admin || responsable || buyer || stockUser);
    setChangeProductItemPermitted(admin || responsable || buyer);
    setCreateQuotePermitted((admin || buyer) && status === "em cotação");
  }, [user, requisition]);

  return {
    editItemFieldsPermitted,
    changeProductItemPermitted,
    createQuotePermitted,
  };
};