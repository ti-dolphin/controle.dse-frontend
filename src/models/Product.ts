export interface Product {
    ID: number;
    codigo: string;
    descricao: string;
    unidade: string;
    quantidade_estoque: number;
    quantidade_reservada: number;
    quantidade_disponivel: number;
}
