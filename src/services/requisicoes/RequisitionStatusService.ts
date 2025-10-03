import api from "../../api";
import { RequisitionStatusPermissions } from "../../hooks/requisicoes/useRequisitionStatusPermissions";

import { Requisition } from "../../models/requisicoes/Requisition";
import { RequisitionStatusAlteration } from "../../models/requisicoes/RequisitionStatusAlteration";
import { User } from "../../models/User";


export interface RequisitionStatus {
    id_status_requisicao: number;
    nome: string;
    acao_posterior: string;
    etapa: number;
    acao_anterior: string;
}

const API_ENDPOINT = '/status_requisicao';
const API_PERMISSION_ENDPOINT = "permissao_status";
class RequisitionStatusService {
  async getMany(id_requisicao: number): Promise<RequisitionStatus[]> {
    const response = await api.get<RequisitionStatus[]>(API_ENDPOINT, {
      params: { id_requisicao },
    });
    return response.data;
  }

  async getById(id_status_requisicao: number): Promise<RequisitionStatus> {
    const response = await api.get<RequisitionStatus>(
      `${API_ENDPOINT}/${id_status_requisicao}`
    );
    return response.data;
  }
  async getStatusPermissions(
    user: User,
    requisition: Requisition
  ): Promise<RequisitionStatusPermissions> {
    const response = await api.get<RequisitionStatusPermissions>(
      `${API_ENDPOINT}/${API_PERMISSION_ENDPOINT}`,
      {
        params: { user, requisition },
      }
    );
    return response.data;
  }

  async getStatusAlterationsByRequisitionId(
    id_requisicao: number
  ): Promise<RequisitionStatusAlteration[]> {
    const response = await api.get<RequisitionStatusAlteration[]>(
      `${API_ENDPOINT}/alteracao`,
      {
        params: { id_requisicao },
      }
    );
    return response.data;
  }

  async create(
    data: Omit<RequisitionStatus, "id_status_requisicao">
  ): Promise<RequisitionStatus> {
    const response = await api.post<RequisitionStatus>(API_ENDPOINT, data);
    return response.data;
  }

  async update(
    id_status_requisicao: number,
    data: Partial<Omit<RequisitionStatus, "id_status_requisicao">>
  ): Promise<RequisitionStatus> {
    const response = await api.put<RequisitionStatus>(
      `${API_ENDPOINT}/${id_status_requisicao}`,
      data
    );
    return response.data;
  }

  async delete(id_status_requisicao: number): Promise<void> {
    await api.delete(`${API_ENDPOINT}/${id_status_requisicao}`);
  }
}

export default new RequisitionStatusService();

