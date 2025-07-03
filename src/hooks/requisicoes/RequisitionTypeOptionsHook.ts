import { useCallback, useEffect, useState } from 'react';
import { RequisitionTypeService } from '../../services/requisicoes/RequisitionTypeService';
import { RequisitionType } from '../../models/requisicoes/RequisitionType';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { Option } from '../../types';

export function useRequisitionTypeOptions() {
    const dispatch = useDispatch();
    const [options, setOptions] = useState<Option[]>([]);

    const fetchTypes = useCallback(async () => {
        try {
            const types: RequisitionType[] = await RequisitionTypeService.getMany();
            const options = types.map((tipo: RequisitionType) => ({
                id: tipo.id_tipo_requisicao,
                name: tipo.nome_tipo
            }));
            setOptions(options);
        } catch (e: any) {
            dispatch(setFeedback({
                type: 'error',
                message: `Erro ao buscar opções de tipos de requisição: ${e.message}`
            }));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    return { reqTypeOptions:  options };
}
