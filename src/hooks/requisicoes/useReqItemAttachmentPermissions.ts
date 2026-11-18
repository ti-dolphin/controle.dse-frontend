import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const useReqItemAttachmentPermissions = () => {
   const [permissionToAdd, setPermissionToAdd] = React.useState(false)
    const requisition = useSelector((state: RootState) => state.requisition.requisition);
    const user = useSelector((state: RootState) => state.user.user);
    React.useEffect(() => {
        const adm = Number(user?.PERM_ADMINISTRADOR) == 1
        const requisitante = Number(user?.CODPESSOA) == Number(requisition.ID_RESPONSAVEL)
        const gerente = Number(user?.CODPESSOA) == Number(requisition.gerente?.CODPESSOA)
        const buyer = Number(user?.PERM_COMPRADOR) == 1

        setPermissionToAdd(adm || requisitante || gerente || buyer);
    }, [requisition]);

    return {permissionToAdd}
}

export default useReqItemAttachmentPermissions