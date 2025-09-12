import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequisitionComment } from "../../../models/requisicoes/RequisitionComment";

interface RequisitionCommentState {
    comments: RequisitionComment[];
    refreshReqComments: boolean
}



const initialState: RequisitionCommentState = {
  comments: [] as RequisitionComment[],
  refreshReqComments: false
};

const requisitionCommentSlice = createSlice({
  name: "requisitionComment",
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<RequisitionComment[]>) {
      state.comments = action.payload;
    },
    addComment(state, action: PayloadAction<RequisitionComment>) {
      state.comments.push(action.payload);
    },

    toggleRefreshReqComments(state) {
      state.refreshReqComments = !state.refreshReqComments
    },
    removeComment(state, action: PayloadAction<number>) {
      state.comments = state.comments.filter((comment : RequisitionComment) => comment.id_comentario_requisicao !== action.payload);
    },
    replaceComment(state, action: PayloadAction<RequisitionComment>) {
      const index = state.comments.findIndex(comment => comment.id_comentario_requisicao === action.payload.id_comentario_requisicao);
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },
  },
});

export const { setComments, addComment, removeComment, replaceComment, toggleRefreshReqComments } = requisitionCommentSlice.actions;
export default requisitionCommentSlice.reducer;





