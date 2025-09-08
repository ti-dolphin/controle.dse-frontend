import { ProductAttachment } from "./ProductAttachment";

export interface Product {
    ID: number;
    codigo: string;
    descricao: string;
    unidade: string;
    anexos? : ProductAttachment[];
    quantidade_estoque: number;
    quantidade_reservada: number;
    quantidade_disponivel: number;
}
