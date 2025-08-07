import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { Checklist } from "../../models/patrimonios/Checklist";



export const useChecklistItemPermission = (checklist  : Partial<Checklist> )=> { 
    const user = useSelector((state: RootState) => state.user.user);
    const [permissionToUploadImage, setPermissionToUploadImage] = useState(false);

    useEffect(( ) => { 
        if(user){ 
            const responsable =  Number(user.CODPESSOA) === Number(checklist.responsavel?.CODPESSOA);
            const adm = Number(user.PERM_ADMINISTRADOR) === 1
          if (responsable || adm) {
            setPermissionToUploadImage(true);
            console.log("has permission to upload image");
            return;
          }
        }
    }, [user]);

    return  { permissionToUploadImage };
};