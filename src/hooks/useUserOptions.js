import { useCallback, useEffect, useState } from "react";
import { UserService } from "../services/UserService";
export const useUserOptions = () => {
    const [userOptions, setUserOptions] = useState([]);
    const fetchUsers = useCallback(async () => {
        const response = await UserService.getMany();
        const options = response.map((user) => ({
            id: user.CODPESSOA,
            name: user.NOME,
        }));
        setUserOptions(options);
    }, []);
    useEffect(() => {
        fetchUsers();
    }, []);
    return { userOptions };
};
