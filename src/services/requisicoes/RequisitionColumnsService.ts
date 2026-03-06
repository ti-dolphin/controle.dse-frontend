import api from "../../api"
import { ReducedUser } from "../../models/User"
import { ColumnPreference } from "../../hooks/table/usePersistedColumnOrder"

const API_ENDPOINT = '/tablePreferences';

export default class RequisitionColumnsService {
  static async get(tableKey: string, user: ReducedUser) {
    const response = await api.get(API_ENDPOINT, {
      params: { tableKey, userId: user.CODPESSOA },
    });
    return response.data;
  }

  static async put(tableKey: string, user: ReducedUser, newOrder: ColumnPreference[]) {
    const response = await api.put(API_ENDPOINT, {
      tableKey,
      userId: user.CODPESSOA,
      newOrder,
    })
    return response.data
  }

  static async delete(tableKey: string, user: ReducedUser) {
    const response = await api.delete(API_ENDPOINT, {
      data: { tableKey, userId: user.CODPESSOA }
    })
    return response.data
  }
}