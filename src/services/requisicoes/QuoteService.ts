// controle.dse-frontend/src/services/requisicoes/QuoteService.ts
import api from "../../api";
import { PaymentCondition } from "../../models/requisicoes/PaymentCondition";
import { Quote } from "../../models/requisicoes/Quote";
import { ShipmentType } from "../../models/requisicoes/ShipmentType";
import { TaxClassification } from "../../models/requisicoes/TaxClassification";

const API_ENDPOINT = "/cotacoes";

class QuoteService {
  static async getMany(params?: any): Promise<any> {
    const response = await api.get(API_ENDPOINT, { params });
    return response.data;
  }

  static async getById(id_cotacao: number): Promise<any> {
    const response = await api.get(`${API_ENDPOINT}/${id_cotacao}`);
    return response.data;
  }

  static async getTaxClassifications(): Promise<TaxClassification[]> {
    const response = await api.get(`${API_ENDPOINT}/cf/classificacoes-fiscais`);
    return response.data;
  }

  static async getShipmentTypes(): Promise<ShipmentType[]> {
    const response = await api.get(`${API_ENDPOINT}/tf/tipos-frete`);
    return response.data;
  }

  static async getPaymentConditions(): Promise<PaymentCondition[]> {
    const response = await api.get(`${API_ENDPOINT}/cp/condicoes-pagamento`);
    return response.data;
  }

  static async create(data: any): Promise<any> {
    const response = await api.post(API_ENDPOINT, data);
    return response.data;
  }

  static async update(id_cotacao: number, data: any): Promise<Quote> {
    const response = await api.put(`${API_ENDPOINT}/${id_cotacao}`, data);
    return response.data;
  }

  static async delete(id_cotacao: number): Promise<any> {
    const response = await api.delete(`${API_ENDPOINT}/${id_cotacao}`);
    return response.data;
  }
}

export default QuoteService;
