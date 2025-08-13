import { useCallback, useEffect, useState } from 'react';
import { RequisitionTypeService } from '../../services/requisicoes/RequisitionTypeService';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../../redux/slices/feedBackSlice';
export function useRequisitionTypeOptions() {
    const dispatch = useDispatch();
    const [options, setOptions] = useState([]);
    const fetchTypes = useCallback(async () => {
        try {
            const types = await RequisitionTypeService.getMany();
            const options = types.map((tipo) => ({
                id: tipo.id_tipo_requisicao,
                name: tipo.nome_tipo
            }));
            setOptions(options);
        }
        catch (e) {
            dispatch(setFeedback({
                type: 'error',
                message: `Erro ao buscar opções de tipos de requisição: ${e.message}`
            }));
        }
    }, [dispatch]);
    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);
    return { reqTypeOptions: options };
}
