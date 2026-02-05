export interface Problema {
  CODAPONT: number;
  CHAPA: string;
  NOME_FUNCIONARIO: string;
  CODSITUACAO: string;
  DATA: string;
  COMPETENCIA: number;
  COMENTADO: boolean;
  PROBLEMA: boolean;
  CODSTATUSAPONT: string;
  DESCRICAO_STATUS: string;
  CODCCUSTO: string;
  NOME_CENTRO_CUSTO: string;
  CODPESSOA_GERENTE: number | null;
  NOME_GERENTE: string | null;
  EMAIL_GERENTE: string | null;
  NOME_LIDER: string;
  MOTIVO_PROBLEMA: string | null;
  JUSTIFICATIVA: string | null;
}
