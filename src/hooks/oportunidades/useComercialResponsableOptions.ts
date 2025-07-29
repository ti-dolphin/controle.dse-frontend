import { useState, useEffect } from "react";
import { UserService } from "../../services/UserService";
import { Option } from "../../types";

export const useComercialResponsableOptions = () => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const response = await UserService.getComercialUsers();
      const options : Option[] = response.map(user => ({
        id: user.CODPESSOA,
        name: user.NOME
      }));
      setOptions(options);
    };
    fetchOptions();
  }, []);

  return { comercialResponsableOptions: options };
};
