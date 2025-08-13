import { useCallback } from "react";
import { formatDateStringtoISOstring } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { clearfilters, setFilters } from "../../redux/slices/oportunidades/opportunityTableSlice";
// Mapeamento dos campos de filtro para caminhos do Prisma
export const filterFieldMap = {
    CODOS: "CODOS.equals",
    NOME: "NOME.contains",
    ID_PROJETO: "ID_PROJETO.equals",
    DATASOLICITACAO: "DATASOLICITACAO.equals",
    DATAINICIO: "DATAINICIO.equals",
    DATAENTREGA: "DATAENTREGA.equals",
    VALOR_TOTAL: "VALOR_TOTAL.gt",
    cliente: "cliente.NOMEFANTASIA.contains",
    projeto: "projeto.DESCRICAO.contains",
    responsavel: "pessoa.NOME.contains",
    status: "status.NOME.contains",
    adicional: "adicionais.NUMERO.equals",
};
// Função para construir filtros compatíveis com Prisma
const buildPrismaFilters = (filters) => {
    return Object.entries(filters)
        .filter(([field, value]) => {
        if (field === "DATASOLICITACAO" ||
            field === "DATAINICIO" ||
            field === "DATAENTREGA") {
            if (!value)
                return false;
            const date = new Date(value);
            if (isNaN(date.getTime()))
                return false;
            if (date.getFullYear() < 1900)
                return false;
        }
        return value !== "" && value !== null;
    })
        .flatMap(([field, value]) => {
        if (field === "DATASOLICITACAO" || field === "DATAINICIO" || field === "DATAENTREGA") {
            return [
                { [field]: { gte: formatDateStringtoISOstring(value) } },
                { [field]: { lte: formatDateStringtoISOstring(value) } },
            ];
        }
        const path = filterFieldMap[field];
        if (!path)
            return [];
        const finalValue = value;
        return [
            path
                .split(".")
                .reverse()
                .reduce((acc, key, idx) => {
                if (idx === 0)
                    return { [key]: finalValue };
                return { [key]: acc };
            }, {}),
        ];
    });
};
// Hook para gerenciar filtros de oportunidades
export const useOpportunityFilters = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.opportunityTable.filters);
    const handleChangeFilters = useCallback((e, field) => {
        const value = e.target.value;
        dispatch(setFilters({ ...filters, [field]: value }));
    }, [filters, dispatch]);
    const clearFilters = useCallback(() => {
        dispatch(clearfilters());
    }, [filters]);
    return { filters, handleChangeFilters, clearFilters, buildPrismaFilters };
};
