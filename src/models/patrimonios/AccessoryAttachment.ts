export interface AccessoryAttachment {
  id_anexo_acessorio_patrimonio: number;
  id_acessorio_patrimonio: number;
  nome: string;
  arquivo: string;
}

export interface CreateAccessoryAttachmentPayload {
  id_acessorio_patrimonio: number;
  nome: string;
  arquivo: string;
}

export interface AccessoryAttachmentDialogProps {
  open: boolean
  onClose: () => void
  accessory: {
    id_acessorio_patrimonio: number
    nome: string
  }
}
