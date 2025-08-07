import React from "react";
import { useEffect } from "react";
import { Option } from "../../types";
import { PatrimonyService } from "../../services/patrimonios/PatrimonyService";
import { PatrimonyType } from "../../models/patrimonios/PatrimonyType";
export const usePatrimonyTypeOptions = ( ) =>  {

    const [patirmonyTypeOptions, setPatirmonyTypeOptions] = React.useState<Option[]>([]);

    const fetch = async ( ) => { 
        const options = await PatrimonyService.getTypes();
        setPatirmonyTypeOptions(
          options.map((type: PatrimonyType) => ({
            id: type.id_tipo_patrimonio,
            name: type.nome_tipo,
          }))
        );
    }

    useEffect(() => { 
        fetch();
    }, []);

    return { patirmonyTypeOptions };
};