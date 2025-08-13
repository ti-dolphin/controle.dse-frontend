import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
export const useChecklistItemPermission = (checklist) => {
    const user = useSelector((state) => state.user.user);
    const [permissionToUploadImage, setPermissionToUploadImage] = useState(false);
    useEffect(() => {
        if (user) {
            const responsable = Number(user.CODPESSOA) === Number(checklist.responsavel?.CODPESSOA);
            const adm = Number(user.PERM_ADMINISTRADOR) === 1;
            if (responsable || adm) {
                setPermissionToUploadImage(true);
                return;
            }
        }
    }, [user]);
    return { permissionToUploadImage };
};
