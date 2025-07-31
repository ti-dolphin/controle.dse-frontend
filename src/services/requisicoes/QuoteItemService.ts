//
import api from "../../api";
const API_ENPOINT = "/item_cotacao";

export class QuoteItemService {
  static getMany = async (params?: any, token?: string) => {
    const config = {
      params,
      ...(token && { headers: { Authorization: token } }),
    };

    const response = await api.get(API_ENPOINT, config);
    return response.data;
  };

  static getById = async (id_item_cotacao: number, token?: string) => {
    const config = token ? { headers: { Authorization: token } } : {};
    const response = await api.get(`${API_ENPOINT}/${id_item_cotacao}`, config);
    return response.data;
  };

  static create = async (data: any) => {
    const response = await api.post(API_ENPOINT, data);
    return response.data;
  };

  static update = async (
    id_item_cotacao: number,
    data: any,
    token?: string
  ) => {
    const config = token ? { headers: { Authorization: token } } : {};
    const response = await api.put(
      `${API_ENPOINT}/${id_item_cotacao}`,
      data,
      config
    );
    return response.data;
  };

  static delete = async (id_item_cotacao: number) => {
    const response = await api.delete(`${API_ENPOINT}/${id_item_cotacao}`);
    return response.data;
  };
}
