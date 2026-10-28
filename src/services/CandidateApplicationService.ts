import api from "../api";

export interface CandidateApplicationPayload {
  nome_completo: string;
  telefone: string;
  cpf: string;
  cidade: string;
  estado: string;
  id_funcoes: number[];
  arquivo: string;
  nome_arquivo: string;
}

export interface CandidateRow {
  id_candidato: number;
  nome_completo: string;
  telefone: string;
  cpf: string;
  cidade: string;
  estado: string;
  atualizado_em: string | null;
  triado: boolean;
  triado_por: number | null;
  triado_por_nome: string;
  triado_em: string | null;
  funcoes: string;
  curriculo: string;
  nome_arquivo: string;
  comentado: boolean;
}

export interface CandidateComment {
  id_comentario: number;
  id_candidato: number;
  comentario: string;
  criado_em: string;
  criado_por: number;
  PESSOA?: { NOME: string | null };
}

const CandidateApplicationService = {
  getFunctions: async (): Promise<Array<{ id_funcao: number; funcao: string }>> => {
    const response = await api.get("/vagas/funcoes");
    return response.data;
  },
  getCandidates: async (): Promise<CandidateRow[]> => {
    const response = await api.get("/vagas/gestao/candidatos");
    return response.data;
  },
  checkManagementAccess: async (): Promise<boolean> => {
    const response = await api.get<{ allowed: boolean }>("/vagas/gestao/acesso");
    return response.data.allowed;
  },
  submit: async (payload: CandidateApplicationPayload): Promise<{ previous_resume_urls: string[] }> => {
    const response = await api.post("/vagas/candidatos", payload);
    return response.data;
  },
  updateRow: async (id_candidato: number, checked: boolean): Promise<{ triado: boolean; triado_por: number | null; triado_em: string | null }> => {
    const body = { id_candidato, checked };
    const response = await api.post('/vagas/updateTriagemCandidato', body)
    return response.data
  },
  getCandidateComments: async (id_candidato: number): Promise<CandidateComment[]> => {
    const response = await api.get(`/vagas/candidatos/${id_candidato}/comentarios`);
    return response.data;
  },
  createCandidateComment: async (id_candidato: number, comentario: string): Promise<CandidateComment> => {
    const response = await api.post('/vagas/createComment', { id_candidato, comentario });
    return response.data;
  },
  deleteCandidateComment: async (id_comentario: number): Promise<void> => {
    await api.delete(`/vagas/comentarios/${id_comentario}`);
  },
};

export default CandidateApplicationService;
