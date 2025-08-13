import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
export const usePatrimonyFormPermissions = (mode, patrimony) => {
    const user = useSelector((state) => state.user.user);
    const [permissionToEdit, setPermissionToEdit] = useState(false);
    useEffect(() => {
        if (mode === "create") {
            setPermissionToEdit(true);
            return;
        }
        if (user && patrimony) {
            setPermissionToEdit(false);
            const responsableForType = Number(user?.CODPESSOA) ===
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
