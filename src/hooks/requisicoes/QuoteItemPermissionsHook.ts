import { useEffect, useState } from "react";
import { User } from "../../models/User";



export const useQuoteItemPermissions = (user : User | null, isSupplierRoute : boolean ) => { 
    const [permissionToEditItems, setPermissionToEditItems] = useState<boolean>(false);
    const [permissionToAddItems, setPermissionToAddItems] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            if (user.PERM_ADMINISTRADOR === 1 || user.PERM_COMPRADOR === 1 || isSupplierRoute) {
                setPermissionToEditItems(true);
            }
            if(user.PERM_ADMINISTRADOR === 1 || user.PERM_COMPRADOR === 1){ 
                setPermissionToAddItems(true);
            }
        }
    }, [user]);
    return { permissionToEditItems, permissionToAddItems };

};