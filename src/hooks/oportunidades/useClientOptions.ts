import { useCallback, useEffect, useState } from "react";
import { Option } from "../../types";
import ClientService from "../../services/ClientService";
import { Client } from "../../models/oportunidades/Client";


export const useClientOptions = () => {
    const [options, setOptions] = useState<Option[]>([]);
    const fetchOptions = useCallback(async () => {
        const clients = await ClientService.getMany();
        const options = clients.map((client : Client) => ({
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
