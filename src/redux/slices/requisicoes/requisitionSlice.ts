import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Requisition } from "../../../models/requisicoes/Requisition";

interface RequisitionFormState {
  requisition: Requisition;
  mode: "view" | "edit" | "create";
  loading: boolean;
  error: string | null;
}

const initialState: RequisitionFormState = {
  requisition: {
      ID_REQUISICAO: 0,
      DESCRIPTION: "",
      ID_PROJETO: 0,
      ID_RESPONSAVEL: 0,
      TIPO: 0,
      data_alteracao: "",
      data_criacao: "",
      id_status_requisicao: 1,
      OBSERVACAO: null
  },
  mode: "view", // inicia em visualização
  loading: false,
  error: null,
};

const requisitionFormSlice = createSlice({
  name: "requisitionForm",
  initialState,
  reducers: {
    setRequisition(state, action: PayloadAction<Requisition>) {
      state.requisition = action.payload;
      state.mode = action.payload.ID_REQUISICAO ? "view" : "create";
    },
    updateRequisitionField(
      state,
      action: PayloadAction<{ field: keyof Requisition; value: any }>
    ) {
      (state.requisition as any)[action.payload.field] = action.payload.value;
    },
    setMode(state, action: PayloadAction<"view" | "edit" | "create">) {
      state.mode = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearRequisition(state) {
      state.requisition = initialState.requisition;
      state.mode = "view";
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setRequisition,
  updateRequisitionField,
  setMode,
  setLoading,
  setError,
  clearRequisition,
} = requisitionFormSlice.actions;
export default requisitionFormSlice.reducer;
