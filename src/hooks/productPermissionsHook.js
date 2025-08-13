export const useProductPermissions = (user) => {
    const adm = Number(user?.PERM_ADMINISTRADOR) == 1;
    const editProductFieldsPermitted = adm;
    return {
        editProductFieldsPermitted,
    };
};
