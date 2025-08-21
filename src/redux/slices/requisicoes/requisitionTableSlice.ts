//requisitionTableSlice

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Requisition } from "../../../models/requisicoes/Requisition";
import { RequisitionKanban } from "../../../models/requisicoes/RequisitionKanban";

// export const filterFieldMap: Record<string, string> = {
//   ID_REQUISICAO: "ID_REQUISICAO.equals",
//   DESCRIPTION: "DESCRIPTION.contains",
//   OBSERVACAO: "OBSERVACAO.contains",
//   responsavel: "pessoa_web_requisicao_ID_RESPONSAVELTopessoa.NOME.contains",
//   alterado_por: "pessoa_web_requisicao_alterado_porTopessoa.NOME.contains",
//   criado_por: "pessoa_web_requisicao_criado_porTopessoa.NOME.contains",
//   projeto: "projetos.DESCRICAO.contains",
//   gerente: "projetos.pessoa.NOME.contains",
//   status: "web_status_requisicao.nome.contains",
//   tipo: "web_tipo_requisicao.nome_tipo.contains",
//   data_criacao: "data_criacao.equals",
// };

export interface RequisitionFilters {
  ID_REQUISICAO: number | null;
  DESCRIPTION: string;
  responsavel: string;
  pessoa_alterado_por: string;
  pessoa_criado_por: string;
  projeto: string;
  gerente: string;
  status: string;
  tipo: string;
  custo_total: number | null;
  responsavel_projeto: string;
  // data_criacao: string;
}
interface RequisitionTableState {
  rows: Requisition[];
  loading: boolean;
  error: string | null;
  selectedRow: Requisition | null;
  kanbans: RequisitionKanban[];
  selectedKanban: RequisitionKanban | null;
  searchTerm: string;
  filters: RequisitionFilters;
  requisitionBeingDeletedId: number | null; // New state to track deletion
}

const initialState: RequisitionTableState = {
  rows: [],
  loading: false,
  error: null,
  selectedRow: null,
  kanbans: [],
  selectedKanban: null,
  searchTerm: "",
  filters: {
    ID_REQUISICAO: null,
    DESCRIPTION: "",
    responsavel: "",
    pessoa_alterado_por: "",
    pessoa_criado_por: "",
    projeto: "",
    gerente: "",
    status: "",
    tipo: "",
    custo_total: null,
    responsavel_projeto: "",
    // data_criacao: "",
  },
  requisitionBeingDeletedId: null, // Initialize with null
};

const requisitionTableSlice = createSlice({
  name: "requisitionTable",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Requisition[]>) {
      state.rows = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSelectedRow(state, action: PayloadAction<Requisition | null>) {
      state.selectedRow = action.payload;
    },
    setKanbans(state, action: PayloadAction<RequisitionKanban[]>) {
      state.kanbans = action.payload;
    },
    removeRow(state, action: PayloadAction<number>) {
      state.rows = state.rows.filter((row) => row.ID_REQUISICAO !== action.payload);
    },
    setSelectedKanban(state, action: PayloadAction<RequisitionKanban | null>) {
      state.selectedKanban = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setFilters(state, action: PayloadAction<RequisitionFilters>) {
      state.filters = action.payload;
    },
    setRequisitionBeingDeletedId(state, action: PayloadAction<number | null>) {
      state.requisitionBeingDeletedId = action.payload; // New reducer to set the deletion ID
    },
    clearfilters(state) {
      state.filters = {
        ID_REQUISICAO: null,
        DESCRIPTION: "",
        responsavel: "",
        pessoa_alterado_por: "",
        pessoa_criado_por: "",
        projeto: "",
        gerente: "",
        status: "",
        tipo: "",
        custo_total: null,
        responsavel_projeto: "",
        // data_criacao: "",
      };
    },
    clearRows(state) {
      state.rows = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setRows,
  setLoading,
  setError,
  clearRows,
  setSelectedRow,
  setKanbans,
  setSelectedKanban,
  setSearchTerm,
  clearfilters,
  setFilters,
  setRequisitionBeingDeletedId, // Export the new action
  removeRow,
} = requisitionTableSlice.actions;
export default requisitionTableSlice.reducer;
