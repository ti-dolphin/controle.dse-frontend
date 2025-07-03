import api from '../api';
import { Project } from '../models/Project';

const API_ENDPOINT = 'projetos';


export const ProjectService = {
    async getMany(params? : any): Promise<Project[]> {
        const response = await api.get<Project[]>(`/${API_ENDPOINT}`, { 
            params : params,
        });
        return response.data;
    },

    async getById(id: number): Promise<Project> {
        const response = await api.get<Project>(`/${API_ENDPOINT}/${id}`);
        return response.data;
    },

    async create(project: Omit<Project, 'id'>): Promise<Project> {
        const response = await api.post<Project>(`/${API_ENDPOINT}`, project);
        return response.data;
    },

    async update(id: number, project: Partial<Project>): Promise<Project> {
        const response = await api.put<Project>(`/${API_ENDPOINT}/${id}`, project);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/${API_ENDPOINT}/${id}`);
    }
};