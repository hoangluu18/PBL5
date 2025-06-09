import axios from "../../axios.customize";
import { StoreRequest } from "../../models/StoreRequestDto";


class StoreRequestService {
    async getAll(): Promise<StoreRequest[]> {
        try {
            const response = await axios.get("/admin/store-requests");
            return response.data.data;
        }
        catch (error) {
            console.error("Error submitting review:", error);
            return [];
        }
    }

    async updateStatus(id: number, status: string, note: string): Promise<string> {
        try {
            const response = await axios.put(`/admin/store-requests/${id}/${status}`, {
                note: note  // Gửi object, axios sẽ tự serialize
            });
            return response.data.data;
        }
        catch (error) {
            console.error("Error updating store request status:", error);
            throw error;
        }
    }
}


export default StoreRequestService;