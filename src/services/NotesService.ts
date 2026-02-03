import api from '../api';
import { NotesFilters } from '../redux/slices/apontamentos/notesTableSlice';

export interface NotesQueryParams {
  searchTerm?: string;
  filters?: NotesFilters;
  page?: number;
  pageSize?: number;
}

const NotesService = {
    getMany: async (params?: NotesQueryParams) => {
        const queryParams: Record<string, any> = {};
        
        if (params?.filters) {
            // Mapear filtros para parâmetros da API
            if (params.filters.CODAPONT) queryParams.CODAPONT = params.filters.CODAPONT;
            if (params.filters.CHAPA) queryParams.CHAPA = params.filters.CHAPA;
            if (params.filters.COMPETENCIA) queryParams.COMPETENCIA = params.filters.COMPETENCIA;
            if (params.filters.CODSITUACAO) queryParams.CODSITUACAO = params.filters.CODSITUACAO;
            if (params.filters.NOME_FUNCIONARIO) queryParams.NOME_FUNCIONARIO = params.filters.NOME_FUNCIONARIO;
            if (params.filters.NOME_FUNCAO) queryParams.NOME_FUNCAO = params.filters.NOME_FUNCAO;
            if (params.filters.NOME_CENTRO_CUSTO) queryParams.NOME_CENTRO_CUSTO = params.filters.NOME_CENTRO_CUSTO;
            if (params.filters.DESCRICAO_STATUS) queryParams.DESCRICAO_STATUS = params.filters.DESCRICAO_STATUS;
            if (params.filters.NOME_LIDER) queryParams.NOME_LIDER = params.filters.NOME_LIDER;
            if (params.filters.NOME_GERENTE) queryParams.NOME_GERENTE = params.filters.NOME_GERENTE;
        }
        
        if (params?.searchTerm) {
            queryParams.searchTerm = params.searchTerm;
        }
        
        if (params?.page !== undefined) {
            queryParams.page = params.page;
        }
        
        if (params?.pageSize !== undefined) {
            queryParams.pageSize = params.pageSize;
        }
        
        const response = await api.get('/notes', { params: queryParams });
        return response.data;
    }
};

export default NotesService;
