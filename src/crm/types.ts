import { ChecklistItemFile, MovementationChecklist } from "../Patrimony/types";
import { Dispatch, MutableRefObject, SetStateAction } from "react";


export interface Opportunity {
  CODOS: number;
  CODTIPOOS: number;
  CODCCUSTO: string;
  OBRA: string;
  DATASOLICITACAO: Date;
  DATANECESSIDADE: Date | null;
  DOCREFERENCIA: string | null;
  LISTAMATERIAIS: string | null;
  DATAINICIO: Date;
  DATAPREVENTREGA: Date;
  DATAENTREGA: Date;
  CODSTATUS: number;
  NOME: string;
  DESCRICAO: string;
  ATIVIDADES: string | null;
  PRIORIDADE: number;
  SOLICITANTE: number;
  RESPONSAVEL: number;
  CODDISCIPLINA: number;
  GUT: number;
  GRAVIDADE: number;
  URGENCIA: number;
  TENDENCIA: number;
  DATALIBERACAO: Date | null;
  RELACIONAMENTO: number;
  FK_CODCLIENTE: number;
  FK_CODCOLIGADA: number;
  VALORFATDIRETO: number;
  VALORSERVICOMO: number;
  VALORSERVICOMATAPLICADO: number;
  VALORMATERIAL: number;
  VALORTOTAL: number;
  CODSEGMENTO: number;
  CODCIDADE: number;
  VALORLOCACAO: number | null;
  ID_ADICIONAL: number;
  ID_PROJETO: number;
  DATAINTERACAO: Date;
  VALORFATDOLPHIN: number;
  PRINCIPAL: boolean;
  VALOR_COMISSAO: number;
  id_motivo_perdido: number;
  observacoes: string | null;
  DESCRICAO_VENDA: string | null;
  EMAIL_VENDA_ENVIADO: boolean;
  status: { CODSTATUS: number; NOME: string; ACAO: number; ATIVO: boolean };
  adicional: {
    ID: number;
    NUMERO: number;
    ID_PROJETO: number;
  };
  cliente: {
    CODCOLIGADA: number;
    CODCLIENTE: string;
    NOMEFANTASIA: string;
  };
  projeto: {
    ID: number;
    DESCRICAO: string;
    CODGERENTE: number;
    ATIVO: number;
    gerente: {
      CODGERENTE: number;
      NOME: string;
    };
  };
  responsavel: {
    CODPESSOA: number;
    NOME: string;
  };
  web_anexos_os : OpportunityFile[]
}

export interface Field {
  label: string;
  dataKey: string;
  autoComplete?: boolean;
  type: "text" | "number" | "date" | "Date" | 'Follower[]';
  data: any; // Pode ser mais específico se souber os tipos possíveis
}

export interface Guide {
  name: string;
  fields: Field[];
}

export interface ChecklistColumnData {
  dataKey: keyof MovementationChecklist;
  label: string;
  numeric?: boolean;
  width?: number;
}
export interface OpportunityGuideProps {
  guide: Guide;
  guidesReference: MutableRefObject<Guide[] | undefined>;
  formDataFilesRef: MutableRefObject<FormData | undefined>
  isLoading: boolean
  setChangeWasMade: Dispatch<SetStateAction<boolean>>
  // renderAutoCompleteValue: (field: OpportunityColumn) => OpportunityOptionField;
  // handleChangeAutoComplete: (
  //   _event: React.SyntheticEvent<Element, Event>,
  //   value: OpportunityOptionField | null,
  //   _reason: AutocompleteChangeReason,
  //   _details?:
  //     | AutocompleteChangeDetails<{
  //         label: string;
  //         id: number;
  //         object: string;
  //       }>
  //     | undefined
  // ) => void;
  // renderOptions: (column: {
  //   label: string;
  //   dataKey: string;
  //   autoComplete?: boolean;
  // }) => OpportunityOptionField[] | undefined;
  // adicional: boolean;
  // currentOppIdSelected: number;
  // opportunity: Opportunity;
  // handleChangeTextField: (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   column: OpportunityColumn
  // ) => void;
  // isDateField: (dataKey: string) => boolean;
  // currentCommentValue: string;
  // handleChangeComentarios: (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   codigoComentario?: number
  // ) => void;
  // editingComment: Comentario | undefined;
  // setEditingComment: React.Dispatch<
  //   React.SetStateAction<Comentario | undefined>
  // >;
  // setCurrentOpportunity: React.Dispatch<React.SetStateAction<Opportunity>>;
  // handleSaveOpportunity: () => Promise<void>;
  // handleChangeFiles: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  // handleDeleteFile: (file: OpportunityFile) => void;
}

export interface GuideSelectorProps {
  guides: Guide[];
  currentSlideIndex: number;
  handleChangeGuide: (index: number) => void;
}

export interface CardChecklistItemProps {
  key: number;
  checklistItem: ChecklistItemFile;
  onOpenItemImage: (checklistItem: ChecklistItemFile) => void;
  onChangeProblem: (checklistItemReceived: ChecklistItemFile) => void;
  onChangeOkay: (checklistItemReceived: ChecklistItemFile) => void;
  onChangeObservation: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    checklistItemReceived: ChecklistItemFile
  ) => void;
  renderItemImage: (checklistItem: ChecklistItemFile) => string;
  renderErrorColor: (checklistItem: ChecklistItemFile) => "gray" | "red";
  renderOkayColor: (checklistItem: ChecklistItemFile) => "gray" | "green";
  renderObservation: (checklistItem: ChecklistItemFile) => string;
  isMovimentationResponsable: () => boolean;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    checklistItem: ChecklistItemFile
  ) => Promise<void>;
  toBeDone: () => boolean;
  isIOS: boolean;
  shouldShowFinalizeButton: boolean;
  handleSendChecklistItems: () => Promise<void>;
  isMobile: boolean
}

export interface Comentario {
CODCOMENTARIO: number;
CODAPONT: number;
CODOS: number;
DESCRICAO: string;
RECCREATEDON: Date | string;
RECCREATEDBY: string;
EMAIL: string;
}


export interface Status {
  CODSTATUS: number;
  NOME: string;
  ACAO: number;
  ATIVO: number;
}
export interface Pessoa {
  CODPESSOA: number;
  NOME: string;
}

export interface Follower {
  id_seguidor_projeto: number;
  id_projeto: number;
  codpessoa: number;
  ativo: number;
  nome: string;
}
export interface OpportunityColumn {
  label: string;
  dataKey: string;
  autoComplete?: boolean;
  type: string;
  key?: number;
}
export interface Client {
  CODCLIENTE: number;
  NOMEFANTASIA: string;
  CODCOLIGADA?: number;
}


export interface OpportunityOptionField {
  label: string;
  id: number;
  object: string;
  key: number;
}
export interface OpportunityFile {
  id_anexo_os: number,
  codos: number,
  nome_arquivo: string,
  arquivo: string
}