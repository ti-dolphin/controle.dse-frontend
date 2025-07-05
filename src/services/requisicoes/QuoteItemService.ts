//
import api from "../../api";
const API_ENPOINT = '/item_cotacao'; 

export class QuoteItemService {
  static getMany = async (params?: any) => {
    const response = await api.get(API_ENPOINT, { 
        params
    });
    return response.data;
  }

  static getById = async (id_item_cotacao: number) => {
    const response = await api.get(`${API_ENPOINT}/${id_item_cotacao}`);
    return response.data;
  }

  static create = async (data: any) => {
    const response = await api.post(API_ENPOINT, data);
    return response.data;
  }

  static update = async (id_item_cotacao: number, data: any) => {
    const response = await api.put(`${API_ENPOINT}/${id_item_cotacao}`, data);
    return response.data;
  }

  static delete = async (id_item_cotacao: number) => {
    const response = await api.delete(`${API_ENPOINT}/${id_item_cotacao}`);
    return response.data;
  }
}
