import { createSlice } from "@reduxjs/toolkit";
const filterFieldMap = {
    id_patrimonio: "id_patrimonio.equals",
    nserie: "nserie.contains",
    nome: "nome.contains",
    valor_compra: "valor_compra.gt",
    patrimonio_tipo: "web_patrimonio.web_tipo_patrimonio.nome_tipo.contains",
    patrimonio_descricao: "web_patrimonio.descricao.contains",
    patrimonio_nome: "web_patrimonio.nome.contains",
    patrimonio_valor_compra: 'web_patrimonio.valor_compra.gt',
    patrimonio_nserie: "web_patrimonio.nserie.contains",
    responsavel: "pessoa.NOME.contains",
    projeto: "projetos.DESCRICAO.contains",
    gerente: "projetos.pessoa.NOME.contains",
};
const initialState = {
    rows: [],
    page: 0,
    pageSize: 10,
    totalRows: 0,
    search: "",
    isLoading: false,
    patrimonyBeingDeleted: null,
    filters: {
        id_patrimonio: "",
        nserie: "",
        nome: "",
        valor_compra: "",
        tipo: "",
        patrimonio_descricao: "",
        patrimonio_nome: "",
        patrimonio_valor_compra: "",
        patrimonio_nserie: "",
        patrimonio_tipo: "",
        responsavel: "",
        projeto: "",
        gerente: "",
    },
};
export const buildPatrimonyPrismaFilters = (filters) => {
    return Object.entries(filters)
        .filter(([_field, value]) => {
        if (typeof value === "number" && value === null)
            return false;
        if (typeof value === "string" && value === "")
            return false;
        return true;
    })
        .flatMap(([field, value]) => {
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
export const patrimonyTableSlice = createSlice({
    name: "patrimonyTable",
    initialState: initialState,
    reducers: {
        setRows: (state, action) => {
            state.rows = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
        },
        setTotalRows: (state, action) => {
            state.totalRows = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        cleanFilters: (state) => {
            state.filters = {
                id_patrimonio: "",
                nserie: "",
                nome: "",
                valor_compra: "",
                tipo: "",
                patrimonio_descricao: "",
                patrimonio_nome: "",
                patrimonio_valor_compra: "",
                patrimonio_nserie: "",
                patrimonio_tipo: "",
                responsavel: "",
                projeto: "",
                gerente: "",
            };
        },
        deleteSingleRow: (state, action) => {
            state.rows = state.rows.filter((row) => row.id_patrimonio !== action.payload);
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setPatrimonyBeingDeleted: (state, action) => {
            state.patrimonyBeingDeleted = action.payload;
        },
    },
});
export const { setRows, setPage, setPageSize, setTotalRows, setSearch, setIsLoading, cleanFilters, setFilters, setPatrimonyBeingDeleted, deleteSingleRow, } = patrimonyTableSlice.actions;
export default patrimonyTableSlice.reducer;
