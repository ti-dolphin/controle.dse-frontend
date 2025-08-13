import React from "react";
import { useEffect } from "react";
import { PatrimonyService } from "../../services/patrimonios/PatrimonyService";
export const usePatrimonyTypeOptions = () => {
    const [patirmonyTypeOptions, setPatirmonyTypeOptions] = React.useState([]);
    const fetch = async () => {
        const options = await PatrimonyService.getTypes();
        setPatirmonyTypeOptions(options.map((type) => ({
            id: type.id_tipo_patrimonio,
            name: type.nome_tipo,
        })));
    };
    useEffect(() => {
        fetch();
    }, []);
    return { patirmonyTypeOptions };
};
