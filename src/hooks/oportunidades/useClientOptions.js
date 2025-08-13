import { useCallback, useEffect, useState } from "react";
import ClientService from "../../services/ClientService";
export const useClientOptions = () => {
    const [options, setOptions] = useState([]);
    const fetchOptions = useCallback(async () => {
        const clients = await ClientService.getMany();
        const options = clients.map((client) => ({
            id: client.CODCLIENTE,
            name: client.NOMEFANTASIA,
        }));
        setOptions(options);
    }, []);
    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);
    return { clientOptions: options };
};
