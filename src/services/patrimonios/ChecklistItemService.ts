import api from "../../api";

const API_ENDPOINT = '/item_checklist_movimentacao';

export class ChecklistItemService{ 
    static async getMany(){
        
    }

    static async getById(){
        
    }

    static async create(){
        
    }

    static async update(id_item_checklist_movimentacao : number,  data : any){
        const response = await api.put(`${API_ENDPOINT}/${id_item_checklist_movimentacao}`, data);
        return response.data;
    }

    static async delete(){
        
    }

}
