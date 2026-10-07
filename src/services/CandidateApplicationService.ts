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
  funcoes: string;
  curriculo: string;
  nome_arquivo: string;
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
  submit: async (payload: CandidateApplicationPayload): Promise<{ previous_resume_urls: string[] }> => {
    const response = await api.post("/vagas/candidatos", payload);
    return response.data;
  },
};

export default CandidateApplicationService;
