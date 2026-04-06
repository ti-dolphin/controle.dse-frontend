export type UserCreationFormState = {
  NOME: string;
  LOGIN: string;
  EMAIL: string;
  SENHA: string;
  confirmarSenha: string;
  PERM_RH: boolean;
  ATIVO: boolean;
  PERM_LOGIN: boolean;
  PERM_REQUISITAR: boolean;
  PERM_COMERCIAL: boolean;
  PERM_COMPRADOR: boolean;
  PERM_ADMINISTRADOR: boolean;
};

export const initialUserCreationFormState: UserCreationFormState = {
  NOME: "",
  LOGIN: "",
  EMAIL: "",
  SENHA: "",
  confirmarSenha: "",
  PERM_RH: false,
  ATIVO: true,
  PERM_LOGIN: true,
  PERM_REQUISITAR: false,
  PERM_COMERCIAL: false,
  PERM_COMPRADOR: false,
  PERM_ADMINISTRADOR: false,
};

export const baseUserPermissionsPayload = {
  SOLICITANTE: false,
  RESPONSAVEL: false,
  LIDER: false,
  PERM_LOGIN: true,
  PERM_EPI: false,
  PERM_AUTENTICACAO: false,
  PERM_OS: false,
  PERM_TIPO: false,
  PERM_STATUS: false,
  PERM_APONT: false,
  PERM_STATUS_APONT: false,
  PERM_GESTAO_PESSOAS: false,
  PERM_CONTROLE_RECESSO: false,
  PERM_PESSOAS: false,
  PERM_COMENT_OS: false,
  PERM_COMENT_APONT: false,
  ATIVO: true,
  PERM_PONTO: false,
  PERM_VENDA: false,
  PERM_FERRAMENTAS: false,
  PERM_CHECKLIST: false,
  PERM_PROSPECCAO: false,
  PERM_APONTAMENTO_PONTO: false,
  PERM_APONTAMENTO_PONTO_JUSTIFICATIVA: false,
  PERM_BANCO_HORAS: false,
  PERM_FOLGA: false,
  PERM_REQUISITAR: 0,
  PERM_COMPRADOR: 0,
  PERM_CADASTRAR_PAT: 0,
  PERM_ADMINISTRADOR: 0,
  PERM_COMERCIAL: 0,
  PERM_DIRETOR: 0,
  PERM_EDITAR_PRODUTOS: 0,
  PERM_ESTOQUE: 0,
  PERM_COMPRADOR_OPERACIONAL: 0,
  PERM_MOVIMENTAR: 0,
  PERM_TI: 0,
};
