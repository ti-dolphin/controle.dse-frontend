
import { PatrimonyType } from "./PatrimonyType";

export interface Patrimony {
    id_patrimonio: number;
    nome: string;
    data_compra: string;
    nserie: string;
    descricao: string;
    pat_legado: string;
    tipo?: PatrimonyType;
    ativo: number;
    fabricante: string | null;
    valor_compra: string;
    id_produto: number;
}


