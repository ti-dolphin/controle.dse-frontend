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
           console.log(`${user?.NOME} has permission to create`);
           setPermissionToEdit(true);
           return;
         }
        if(user && patrimony){
           setPermissionToEdit(false);
           const responsableForType = Number(user?.CODPESSOA) === Number(patrimony?.tipo_patrimonio?.responsavel_tipo);
           const adm = Number(user?.PERM_ADMINISTRADOR) === 1;
           if ((responsableForType && mode === 'edit') || adm) {
            console.log(`${user?.NOME} has permission to edit`);
            setPermissionToEdit(true);
            return;
           }

        }
    }, [user, patrimony, mode]);

    return { permissionToEdit };
};