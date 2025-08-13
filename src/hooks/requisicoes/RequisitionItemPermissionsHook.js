import { useEffect, useState } from "react";
export const useRequisitionItemPermissions = (user, requisition) => {
    const [editItemFieldsPermitted, setEditItemFieldsPermitted] = useState(false);
    const [changeProductItemPermitted, setChangeProductItemPermitted] = useState(false);
    const [createQuotePermitted, setCreateQuotePermitted] = useState(false);
    useEffect(() => {
        const adm = Number(user?.PERM_ADMINISTRADOR) == 1;
        const responsable = Number(user?.CODPESSOA) == Number(requisition.ID_RESPONSAVEL) && requisition.status?.nome === "Em edição";
        setEditItemFieldsPermitted(adm || responsable || Number(user?.PERM_COMPRADOR) === 1);
        setChangeProductItemPermitted(adm || responsable);
        setCreateQuotePermitted((adm || Number(user?.PERM_COMPRADOR) === 1) &&
            requisition.status?.nome === "Em cotação");
    }, [user, requisition]);
    return {
        editItemFieldsPermitted,
        changeProductItemPermitted,
        createQuotePermitted,
    };
};
