
import { PatrimonyType } from "./PatrimonyType";

export interface Patrimony {
    id_patrimonio: number;
    nome: string;
    data_compra: string;
    nserie: string;
    descricao: string;
    pat_legado: string;
    tipo: number;
    tipo_patrimonio?: PatrimonyType;
    ativo: number;
    fabricante: string | null;
    valor_compra: number;
    id_produto: number;
}


