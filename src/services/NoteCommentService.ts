import api from '../api';
import { NoteComment } from '../models/NoteComment';

const NoteCommentService = {
  getMany: async (CODAPONT: number): Promise<NoteComment[]> => {
    const response = await api.get('/comentarios_apontamento', {
      params: { CODAPONT }
    });
    return response.data;
  },

  getById: async (CODCOMENTARIO: number): Promise<NoteComment> => {
    const response = await api.get(`/comentarios_apontamento/${CODCOMENTARIO}`);
    return response.data;
  },

  create: async (data: Partial<NoteComment>): Promise<NoteComment> => {
    const response = await api.post('/comentarios_apontamento', data);
    return response.data;
  },

  update: async (CODCOMENTARIO: number, data: Partial<NoteComment>): Promise<NoteComment> => {
    const response = await api.put(`/comentarios_apontamento/${CODCOMENTARIO}`, data);
    return response.data;
  },

  delete: async (CODCOMENTARIO: number): Promise<void> => {
    await api.delete(`/comentarios_apontamento/${CODCOMENTARIO}`);
  }
};

export default NoteCommentService;
