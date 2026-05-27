import apiLocal from "../../apiLocal";
import { OrdemCompraFilters } from "../../redux/slices/ordensCompra/ordemCompraTableSlice";

const API_ENDPOINT = "/ordem_de_compra";

interface OrdemCompraQuery {
  searchTerm: string;
  filters: OrdemCompraFilters;
  page: number;
  pageSize: number;
}

interface ApprovalPayload {
  approved: boolean;
  login: string;
  codGerente: number | null;
}

const OrdemCompraService = {
  getMany: async ({ searchTerm, filters, page, pageSize }: OrdemCompraQuery) => {
    const response = await apiLocal.get(API_ENDPOINT, {
      params: {
        searchTerm,
        filters: JSON.stringify(filters || {}),
        page,
        pageSize,
      },
    });
    return response.data;
  },
  updateApproval: async (id: number, payload: ApprovalPayload) => {
    const response = await apiLocal.patch(`${API_ENDPOINT}/${id}/approval`, payload);
    return response.data;
  },
};

export default OrdemCompraService;
