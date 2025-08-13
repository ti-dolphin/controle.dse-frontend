import React, { useState } from 'react';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import { useDispatch } from 'react-redux';
const useOppStatusOptions = () => {
    const dispatch = useDispatch();
    const [options, setOptions] = useState([]);
    const fetchData = React.useCallback(async () => {
        const oppStatus = await OpportunityService.getOppStatusOptions();
        const options = oppStatus.map((status) => ({
            id: status.CODSTATUS,
            name: status.NOME
        }));
        setOptions(options);
    }, [dispatch]);
    React.useEffect(() => {
        fetchData();
    }, [fetchData]);
    return { oppStatusOptions: options };
};
export default useOppStatusOptions;
