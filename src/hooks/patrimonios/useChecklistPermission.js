import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
export const useChecklistPermission = (checklist) => {
    const user = useSelector((state) => state.user.user);
    const [permissionToFullfill, setPermissionToFullfill] = useState(false);
    const [permissionToAprove, setPermissionToAprove] = useState(false);
    useEffect(() => {
        setPermissionToFullfill(false);
        setPermissionToAprove(false);
        const responsableForType = Number(user?.CODPESSOA) ===
            Number(checklist.patrimonio?.tipo_patrimonio?.responsavel_tipo);
        const responsableForChecklist = Number(user?.CODPESSOA) === Number(checklist.responsavel?.CODPESSOA);
        const waitingAproval = checklist.realizado && !checklist.aprovado;
        const adm = Number(user?.PERM_ADMINISTRADOR) === 1;
        const finished = checklist.realizado && checklist.aprovado;
        //apenas o responsável do tipo ou adm podem aprovar ou reprovar
        if ((responsableForType && waitingAproval) || (adm && waitingAproval)) {
            setPermissionToAprove(true);
        }
        //o checklist deve estar aguardando aprovação para poder ser concluído
        if ((responsableForChecklist && !(finished || waitingAproval)) ||
            (adm && !(finished || waitingAproval))) {
            setPermissionToFullfill(true);
        }
    }, [checklist]);
    return { permissionToFullfill, permissionToAprove };
};
