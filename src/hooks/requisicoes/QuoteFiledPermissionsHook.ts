import { useEffect, useState } from "react";
import { User } from "../../models/User";

export const useQuoteFieldPermissions = (
  user: User | null,
  isSupplierRoute: boolean
) => {
  const [permissionToEditFields, setPermissionToEditFields] = useState<boolean>(false);

  useEffect(() => {
    if(user){ 
      if (user.PERM_ADMINISTRADOR === 1 || user.PERM_COMPRADOR === 1) {
        setPermissionToEditFields(true);
        return;
      }
    }
    if(isSupplierRoute) setPermissionToEditFields(true);
  }, [user, isSupplierRoute]);
  return { permissionToEditFields };
};