export interface Ponto {
  CODAPONT: number;
  CHAPA: string;
  NOME_FUNCIONARIO: string;
  BANCO_HORAS: number;
  DATA: string;
  VERIFICADO: boolean;
  PROBLEMA: boolean;
  MOTIVO_PROBLEMA: string | null;
  JUSTIFICATIVA: string | null;
  COMPETENCIA: number;
  CODSTATUSAPONT: string;
  DESCRICAO_STATUS: string;
  CODCCUSTO: string;
  NOME_CENTRO_CUSTO: string;
  CODLIDER: number;
  NOME_LIDER: string;
  DATA_HORA_MOTIVO: string | null;
  DATA_HORA_JUSTIFICATIVA: string | null;
  AJUSTADO: boolean;
  JUSTIFICADO_POR: string | null;
}
