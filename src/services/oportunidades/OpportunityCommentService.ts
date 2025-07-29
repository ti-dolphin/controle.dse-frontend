import api from "../../api";

const API_ENDPOINT = '/comentarios_oportunidade';

export class OpportunityCommentService { 
    static async getMany(CODOS : number) {
        const response =  await api.get(API_ENDPOINT, { 
            params: {CODOS}
        });
        return response.data;
    }   

    static async getById(CODCOMENTARIO: number) {
        return await api.get(`${API_ENDPOINT}/${CODCOMENTARIO}`);
    }

    static async create(data: any) {
        const response =  await api.post(API_ENDPOINT, data);
        return response.data;
    }

    static async update(CODCOMENTARIO: number, data: any) {
        const resopnse = await api.put(`${API_ENDPOINT}/${CODCOMENTARIO}`, data);
        return resopnse.data;
    }

    static async delete(CODCOMENTARIO: number) {
        return await api.delete(`${API_ENDPOINT}/${CODCOMENTARIO}`);
    }
}