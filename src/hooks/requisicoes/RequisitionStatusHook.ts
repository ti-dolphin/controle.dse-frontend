import { useState, useEffect } from 'react';
import { RequisitionStatus } from '../../models/requisicoes/RequisitionStatus';
import RequisitionStatusStepper from '../../components/requisicoes/RequisitionStatusStepper';
import RequisitionStatusService from '../../services/requisicoes/RequisitionStatusService';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { useCallback } from 'react';


export const useRequisitionStatus =  ( ) =>  {

    const dispatch = useDispatch();
    const [statusList, setStatusList] = useState<RequisitionStatus[]>([]);
    const [canceledStatus, setCanceledStatus] = useState<RequisitionStatus>();

    const fetchData = useCallback(async () => { 
        //FUNCTION THE FETCHES THE DATA
        try { 
            const statuses = await RequisitionStatusService.getMany();
            const canceledStatus = statuses.find(status => status.nome === 'Cancelado');
            setStatusList(statuses.filter((status) => status.nome !== 'Cancelado')); //FILTERS OUT THE "CANCELED" STATUS
            setCanceledStatus(canceledStatus);
            
        } catch (e) { 
            dispatch(setFeedback({ 
                type: 'error',
                message: 'Erro ao buscar status'
            }));
        }
    }, [dispatch]);

    useEffect(() => { 
        fetchData();
    }, [fetchData]);

    const orderedStatusList = [...statusList].sort((a, b) => a.etapa - b.etapa);
    return { statusList: orderedStatusList, canceledStatus };

}