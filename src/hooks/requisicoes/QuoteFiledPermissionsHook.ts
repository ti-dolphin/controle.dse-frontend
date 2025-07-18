import { Quote } from "../../models/requisicoes/Quote";
import { useEffect, useState } from "react";
import { User } from "../../models/User";

export const useQuoteFieldPermissions = (
  user: User | null,
  quote: Quote | null,
  isSupplierRoute: boolean
) => {
  const [permissionToEditFields, setPermissionToEditFields] = useState<boolean>(false);

  useEffect(() => {
    if (user && quote) {
      if (
        user.PERM_ADMINISTRADOR === 1 ||
        user.PERM_COMPRADOR === 1 ||
        isSupplierRoute
      ) {
        setPermissionToEditFields(true);
        return;
      }
    }
  }, [user, quote]);
  return { permissionToEditFields };
};