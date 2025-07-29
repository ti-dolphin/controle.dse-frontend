import api from "../../api";

const API_ENDPOINT = '/anexos_oportunidade';
// // Get all opportunity attachments
// router.get("/", OpportunityAttachmentController.getMany);

// // Get an opportunity attachment by ID
// router.get("/:id_anexo_os", OpportunityAttachmentController.getById);

// // Create a new opportunity attachment
// router.post("/", OpportunityAttachmentController.create);

// // Update an opportunity attachment by ID
// router.put("/:id_anexo_os", OpportunityAttachmentController.update);

// // Delete an opportunity attachment by ID
// router.delete("/:id_anexo_os", OpportunityAttachmentController.delete);

 class OpportunityAttachmentService {
    async getMany(CODOS : number) {
        const response = await api.get(`${API_ENDPOINT}?CODOS=${CODOS}`);
        return response.data;
    }
    async getById(id_anexo_os : number) {
        const response = await api.get(`${API_ENDPOINT}/${id_anexo_os}`);
        return response.data;
    }
    async create(data : any) {
        const response = await api.post(API_ENDPOINT, data);
        return response.data;
    }
    async update(id_anexo_os : number, data : any) {
        const response = await api.put(`${API_ENDPOINT}/${id_anexo_os}`, data);
        return response.data;
    }
    async delete(id_anexo_os : number) {
        const response = await api.delete(`${API_ENDPOINT}/${id_anexo_os}`);
        return response.data;
    }
}

export default new OpportunityAttachmentService();