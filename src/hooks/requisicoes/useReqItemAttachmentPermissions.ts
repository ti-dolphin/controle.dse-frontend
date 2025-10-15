import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const useReqItemAttachmentPermissions = () => {
   const [permissionToAdd, setPermissionToAdd] = React.useState(false)
    const requisition = useSelector((state: RootState) => state.requisition.requisition);
    const user = useSelector((state: RootState) => state.user.user);
    React.useEffect(() => {
        const allowedStatus = ['em cotação', 'requisitado', 'em edição'];
        const adm = Number(user?.PERM_ADMINISTRADOR) == 1
        const responsable = Number(user?.CODPESSOA) == Number(requisition.ID_RESPONSAVEL) && allowedStatus.includes(requisition.status?.nome ? requisition.status?.nome.toLowerCase() : '');
        const buyer = Number(user?.PERM_COMPRADOR) == 1 && allowedStatus.includes(requisition.status?.nome ? requisition.status?.nome.toLowerCase() : '');

        setPermissionToAdd(adm || responsable || buyer);
    }, [requisition]);

    return {permissionToAdd}
}

export default useReqItemAttachmentPermissions