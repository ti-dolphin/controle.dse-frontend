import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
export const useMovementationPermissions = (rows) => {
    const user = useSelector((state) => state.user.user);
    const [permissionToCreateNew, setPermissionToCreateNew] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState(false);
    const getCurrentRespnsable = () => {
        const mostRecentMov = rows[0];
        return Number(mostRecentMov?.responsavel?.CODPESSOA);
    };
    useEffect(() => {
        if (user) {
            setPermissionToCreateNew(false);
            setPermissionToDelete(false);
            const adm = Number(user.PERM_ADMINISTRADOR) === 1;
            const currentResonsable = Number(user.CODPESSOA) === getCurrentRespnsable();
            if (adm || currentResonsable) {
                setPermissionToCreateNew(true);
            }
            if (adm) {
                setPermissionToDelete(true);
                return;
            }
        }
    }, [user, rows]);
    return { permissionToCreateNew, permissionToDelete };
};
