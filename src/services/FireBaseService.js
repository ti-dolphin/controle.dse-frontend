import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, } from "firebase/storage";
import { getAuth } from "firebase/auth";
import firebaseApp from "../../firebaseConfig";
class FirebaseService {
    // Método estático para obter o Storage
    static getStorage() {
        return getStorage(firebaseApp);
    }
    // Método estático para obter a Autenticação
    static getAuth() {
        return getAuth(firebaseApp);
    }
    // Método estático para fazer upload de um arquivo
    static async upload(file, filename) {
        const storage = this.getStorage();
        const storageRef = ref(storage, `${filename}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    }
    // Método estático para deletar um arquivo
    static async delete(url) {
        const storage = this.getStorage();
        const storageRef = ref(storage, `${url}`);
        await deleteObject(storageRef);
    }
    // Método estático para obter a URL de um arquivo
    static async getFile(url) {
        try {
            const storage = this.getStorage();
            const storageRef = ref(storage, `${url}`);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}
export default FirebaseService;
