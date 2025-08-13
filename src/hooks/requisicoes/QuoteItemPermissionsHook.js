import { useEffect, useState } from "react";
export const useQuoteItemPermissions = (user, isSupplierRoute) => {
    const [permissionToEditItems, setPermissionToEditItems] = useState(false);
    const [permissionToAddItems, setPermissionToAddItems] = useState(false);
    useEffect(() => {
        if (user) {
            if (user.PERM_ADMINISTRADOR === 1 || user.PERM_COMPRADOR === 1) {
                setPermissionToEditItems(true);
                setPermissionToAddItems(true);
                return;
            }
        }
        if (isSupplierRoute)
            setPermissionToEditItems(true);
    }, [isSupplierRoute, user]);
    return { permissionToEditItems, permissionToAddItems };
};
