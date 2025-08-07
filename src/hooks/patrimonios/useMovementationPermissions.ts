import { useSelector } from "react-redux";
import { Movimentation } from "../../models/patrimonios/Movementation";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";

export const useMovementationPermissions = (rows : Partial<Movimentation>[] ) => { 
    const user = useSelector((state: RootState) => state.user.user); 
    const [permissionToCreateNew, setPermissionToCreateNew] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState(false);
    const getCurrentRespnsable = ( ) => { 
        const mostRecentMov = rows[0];
        return Number(mostRecentMov?.responsavel?.CODPESSOA);
    }

    useEffect(( ) => { 
        if(user){ 
            setPermissionToCreateNew(false);
            setPermissionToDelete(false);
            const adm = Number(user.PERM_ADMINISTRADOR) === 1
            const currentResonsable = Number(user.CODPESSOA) === getCurrentRespnsable();
          if (adm || currentResonsable) {
            setPermissionToCreateNew(true);
            console.log("has permission to create new movementation");
          }
          if(adm){ 
            setPermissionToDelete(true);
            console.log("has permission to delete movementation");
            return;
          }
        }
    }, [user, rows]);

    return { permissionToCreateNew , permissionToDelete };
};  