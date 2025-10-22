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
  console.log('status da requisição: ', status);
  console.log('VALIDAÇÃO PERM BUYER SAMUEL: ', Number(user?.PERM_COMPRADOR) === 1, editionEnabledStatuses.includes(status));
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


    console.log("responsable: ", responsable);
    console.log("admin: ", admin);
    console.log("buyer: ", buyer);

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