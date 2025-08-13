import { useState, useEffect } from "react";
import { UserService } from "../../services/UserService";
export const useComercialResponsableOptions = () => {
    const [options, setOptions] = useState([]);
    useEffect(() => {
        const fetchOptions = async () => {
            const response = await UserService.getComercialUsers();
            const options = response.map(user => ({
                id: user.CODPESSOA,
                name: user.NOME
            }));
            setOptions(options);
        };
        fetchOptions();
    }, []);
    return { comercialResponsableOptions: options };
};
