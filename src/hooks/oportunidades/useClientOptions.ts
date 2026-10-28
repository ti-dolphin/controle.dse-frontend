import { useCallback, useEffect, useState } from "react";
import { Option } from "../../types";
import ClientService from "../../services/ClientService";
import { Client } from "../../models/oportunidades/Client";


export const useClientOptions = (onlyDse = false) => {
    const [options, setOptions] = useState<Option[]>([]);
    const fetchOptions = useCallback(async () => {
        const clients = await ClientService.getMany();
        const options = clients
          .filter((client: Client) =>
            !onlyDse || String(client.NOMEFANTASIA ?? "").toLowerCase().includes("dse")
          )
          .map((client : Client) => ({
            id: client.CODCLIENTE,
            name: client.NOMEFANTASIA,
        }));
        setOptions(options);
    }, [onlyDse]);

    useEffect(() => {
      fetchOptions();
    }, [fetchOptions]);

    return { clientOptions: options };
};
