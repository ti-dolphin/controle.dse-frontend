import { User } from '../models/User';
import api from '../api';

const API_URL = '/users'; // ajuste conforme seu backend

export class UserService {
  static async getById(CODPESSOA: number): Promise<User> {
    const { data } = await api.get<User>(`${API_URL}/${CODPESSOA}`);
    return data;
  }

  static async getMany(params?: Record<string, any>): Promise<User[]> {
    const { data } = await api.get<User[]>(API_URL, { params });
    return data;
  }

  static async login({ LOGIN, SENHA }: { LOGIN: string; SENHA: string }): Promise<{ user: User; token: string }> {
    const { data } = await api.post<{ user: User; token: string }>(`${API_URL}/login`, { LOGIN, SENHA });
    return data;
  }

  static async create(payload: Partial<User>): Promise<User> {
    const { data } = await api.post<User>(API_URL, payload);
    return data;
  }

  static async update(CODPESSOA: number, payload: Partial<User>): Promise<User> {
    const { data } = await api.put<User>(`${API_URL}/${CODPESSOA}`, payload);
    return data;
  }

  static async delete(CODPESSOA: number): Promise<User> {
    const { data } = await api.delete<User>(`${API_URL}/${CODPESSOA}`);
    return data;
  }
}
