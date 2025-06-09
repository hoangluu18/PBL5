import axios from "../axios.customize";
import { StoreRequestDto, StoreRequestDtoImpl } from "../models/dto/StoreRequestDto";


class StoreRequestService {
    async save(storeRequest: StoreRequestDto): Promise<void> {
        try {
            const response = await axios.post("/store-requests/save", storeRequest);
            if (response.status === 201) {
                console.log("Store request saved successfully.");
            } else {
                console.error("Failed to save store request:", response.statusText);
            }
        }
        catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    async getByCustomerId(customerId: number): Promise<StoreRequestDtoImpl | undefined> {
        try {
            const response = await axios.get<StoreRequestDtoImpl>(`/store-requests/customer/${customerId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching store requests:", error);
            return undefined;
        }
    }

}


export default StoreRequestService;