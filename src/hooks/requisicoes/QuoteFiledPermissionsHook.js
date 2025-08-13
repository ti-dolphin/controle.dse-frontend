import { useEffect, useState } from "react";
export const useQuoteFieldPermissions = (user, isSupplierRoute) => {
    const [permissionToEditFields, setPermissionToEditFields] = useState(false);
    useEffect(() => {
        if (user) {
            if (user.PERM_ADMINISTRADOR === 1 || user.PERM_COMPRADOR === 1) {
                setPermissionToEditFields(true);
                return;
            }
        }
        if (isSupplierRoute)
            setPermissionToEditFields(true);
    }, [user, isSupplierRoute]);
    return { permissionToEditFields };
};
