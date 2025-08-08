import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { Patrimony } from "../../models/patrimonios/Patrimony";
import { set } from "lodash";

export const usePatrimonyFormPermissions = (mode : string, patrimony : Partial<Patrimony> | undefined ) => { 
    const user = useSelector((state: RootState) => state.user.user);
    const [permissionToEdit, setPermissionToEdit] = useState(false);

    useEffect(( ) => { 
         if (mode === "create") {
           setPermissionToEdit(true);
           return;
         }
         if (user && patrimony) {
           setPermissionToEdit(false);
           const responsableForType =
             Number(user?.CODPESSOA) ===
             Number(patrimony?.tipo_patrimonio?.responsavel_tipo);
           const adm = Number(user?.PERM_ADMINISTRADOR) === 1;
           if ((responsableForType && mode === "edit") || adm) {
             setPermissionToEdit(true);
             return;
           }
         }
    }, [user, patrimony, mode]);

    return { permissionToEdit };
};