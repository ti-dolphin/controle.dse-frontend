import { User } from "../models/User";


export const useProductPermissions = (user : User | null) => { 
        const adm = Number(user?.PERM_ADMINISTRADOR) == 1
        const editProductFieldsPermitted = adm;
        return {
            editProductFieldsPermitted,
        }
};