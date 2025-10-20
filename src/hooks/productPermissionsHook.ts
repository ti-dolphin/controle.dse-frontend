import { useEffect, useState } from "react";
import { User } from "../models/User";


export const useProductPermissions = (user : User | null) => { 

       const [editProductFieldsPermitted, setEditProductFieldsPermitted] = useState<boolean>(false);
       useEffect(() =>{
        if(user){ 
          if (user.PERM_ESTOQUE) {
            setEditProductFieldsPermitted(true);
            return;
          }
        }
       }, [user]);
       
       const hasStockPermission = user?.PERM_ESTOQUE === 1 || user?.PERM_ADMINISTRADOR === 1;
  
       const canEditStockFields = hasStockPermission || editProductFieldsPermitted;
  
       return { 
         editProductFieldsPermitted,
         hasStockPermission,
         canEditStockFields,
       };
};