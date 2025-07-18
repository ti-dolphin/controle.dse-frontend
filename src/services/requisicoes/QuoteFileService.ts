import api from "../../api";


const API_ENDPOINT = '/anexo_cotacao';
export class QuoteFileService {
  static getMany = async (params : any) => {
    const response = await api.get(API_ENDPOINT, { 
        params
    });
    return response.data;
  }

  static getById = async (id_anexo_cotacao: number) => {
    const response = await api.get(`${API_ENDPOINT}/${id_anexo_cotacao}`);
    return response.data;
  }

  static create = async (data: any) => {
    const response = await api.post(API_ENDPOINT, data);
    return response.data;
  }

  static update = async (id_anexo_cotacao: number, data: any) => {
    const response = await api.put(`${API_ENDPOINT}/${id_anexo_cotacao}`, data);
    return response.data;
  }

  static delete = async (id_anexo_cotacao: number) => {
    const response = await api.delete(`${API_ENDPOINT}/${id_anexo_cotacao}`);
    return response.data;
  }
}


