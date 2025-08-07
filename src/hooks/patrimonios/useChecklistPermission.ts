import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { Checklist } from "../../models/patrimonios/Checklist";
import { set } from "lodash";


export const useChecklistPermission = (checklist : Partial<Checklist>) => {
    const user = useSelector((state: RootState) => state.user.user);
    const [permissionToFullfill, setPermissionToFullfill] = useState(false);
    const [permissionToAprove, setPermissionToAprove] = useState(false);
    

    useEffect(( ) => {
        setPermissionToFullfill(false);
        setPermissionToAprove(false);
        const responsableForType = Number(user?.CODPESSOA) === Number(checklist.patrimonio?.tipo_patrimonio?.responsavel_tipo);
        const responsableForChecklist = Number(user?.CODPESSOA) === Number(checklist.responsavel?.CODPESSOA);
        const waitingAproval = checklist.realizado && !checklist.aprovado;
        const adm = Number(user?.PERM_ADMINISTRADOR) === 1;
        if ((responsableForType && waitingAproval) || adm) {
          console.log(`${user?.NOME} has permission to aprove`);
          setPermissionToAprove(true);
        }
        if (responsableForChecklist || adm) {
            console.log(`${user?.NOME} has permission to fullfill`);
            setPermissionToFullfill(true);
        }
        
     }, [checklist]);
     
    return { permissionToFullfill, permissionToAprove };
}