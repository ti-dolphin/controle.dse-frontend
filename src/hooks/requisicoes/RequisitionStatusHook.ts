import { useState, useEffect } from 'react';
import { RequisitionStatus } from '../../models/requisicoes/RequisitionStatus';
import RequisitionStatusService from '../../services/requisicoes/RequisitionStatusService';
import { useDispatch, useSelector } from 'react-redux';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { useCallback } from 'react';
import { RootState } from '../../redux/store';


export const useRequisitionStatus = (id_requisicao: number) => {
  const dispatch = useDispatch();
  const [statusList, setStatusList] = useState<RequisitionStatus[]>([]);
  const [canceledStatus, setCanceledStatus] = useState<RequisitionStatus>();
  const {refreshRequisition } = useSelector((state: RootState) => state.requisition);
  const fetchData = useCallback(async () => {
    //FUNCTION THE FETCHES THE DATA
    try {
      const statuses = await RequisitionStatusService.getMany(id_requisicao);
      const canceledStatus = statuses.find(
        (status) => status.nome === "Cancelado"
      );
      setStatusList(statuses.filter((status) => status.nome !== "Cancelado")); //FILTERS OUT THE "CANCELED" STATUS
      setCanceledStatus(canceledStatus);
    } catch (e) {
      dispatch(
        setFeedback({
          type: "error",
          message: "Erro ao buscar status",
        })
      );
    }
  }, [dispatch, refreshRequisition]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const orderedStatusList = [...statusList].sort((a, b) => a.etapa - b.etapa);
  return { statusList: orderedStatusList, canceledStatus };
};