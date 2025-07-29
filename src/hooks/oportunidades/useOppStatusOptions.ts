import React, { useState } from 'react';
import { Option } from '../../types';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import { useDispatch } from 'react-redux';
import { OpportunityState } from '../../redux/slices/oportunidades/opportunitySlice';
import { OpportunityStatus } from '../../models/oportunidades/OpportunityStatus';
const useOppStatusOptions = () => {
    const dispatch = useDispatch();
    const [options, setOptions] = useState<Option[]>([])

    const fetchData = React.useCallback(async () => {
      console.log("fetchData");
      const oppStatus = await OpportunityService.getOppStatusOptions();
      const options = oppStatus.map((status: OpportunityStatus) => ({
        id: status.CODSTATUS,
        name: status.NOME
      }))
      setOptions(options);
    }, [dispatch]);

    React.useEffect(() => {
      fetchData();
    }, [fetchData]);

    return { oppStatusOptions: options }
}

export default useOppStatusOptions