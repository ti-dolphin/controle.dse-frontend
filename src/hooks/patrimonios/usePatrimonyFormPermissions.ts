import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { Patrimony } from "../../models/patrimonios/Patrimony";

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
        const canEdit = Number(user?.PERM_ADMINISTRADOR) === 1 || Number(user?.PERM_ESTOQUE) === 1
        if ((responsableForType && mode === "edit") || canEdit) {
          setPermissionToEdit(true);
          return;
        }
      }
    }, [user, patrimony, mode]);

    return { permissionToEdit };
};