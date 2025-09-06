import { useEffect, useState } from "react";
import { User } from "../models/User";


export const useProductPermissions = (user : User | null) => { 

       const [editProductFieldsPermitted, setEditProductFieldsPermitted] = useState<boolean>(false);


       useEffect(() =>{
        if(user){ 
          if (user.PERM_EDITAR_PRODUTOS === 1 || user.PERM_ADMINISTRADOR === 1) {
            setEditProductFieldsPermitted(true);
            return;
          }
        }
       }, [user]);
       return { editProductFieldsPermitted };
};