import api from "../../api"
import { ReducedUser } from "../../models/User"

const API_ENDPOINT = '/tablePreferences';

export default class RequisitionColumnsService {
  static async get(tableKey: string, user: ReducedUser) {
    const response = await api.get(API_ENDPOINT, {
      params: { tableKey, userId: user.CODPESSOA },
    });
    return response.data;
  }

  static async put(tableKey: string, user: ReducedUser, newOrder: string[]) {
    const response = await api.put(API_ENDPOINT, {
      params: {tableKey, user, newOrder}
    })
    return response.data
  }
}