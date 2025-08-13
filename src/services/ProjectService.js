import api from '../api';
const API_ENDPOINT = 'projetos';
export const ProjectService = {
    async getMany(params) {
        const response = await api.get(`/${API_ENDPOINT}`, {
            params: params,
        });
        return response.data;
    },
    async getById(id) {
        const response = await api.get(`/${API_ENDPOINT}/${id}`);
        return response.data;
    },
    async create(project) {
        const response = await api.post(`/${API_ENDPOINT}`, project);
        return response.data;
    },
    async addFollower(id_projeto, id_seguidor) {
        const response = await api.post(`/${API_ENDPOINT}/${id_projeto}/seguidores`, {
            codpessoa: id_seguidor,
            id_projeto: id_projeto,
        });
        return response.data;
    },
    async getFollowers(ID) {
        const response = await api.get(`/${API_ENDPOINT}/${ID}/seguidores`);
        return response.data;
    },
    async deleteFollower(id_seguidor_projeto, ID) {
        const response = await api.delete(`/${API_ENDPOINT}/${ID}/seguidores/${id_seguidor_projeto}`);
        return response.data;
    },
    async update(id, project) {
        const response = await api.put(`/${API_ENDPOINT}/${id}`, project);
        return response.data;
    },
    async delete(id) {
        await api.delete(`/${API_ENDPOINT}/${id}`);
    },
};
