import axios from "axios";
const API_URL = "http://localhost:8081/api/customers";


class CustomerService {
    async checkUniqueEmail(email: string): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}/checkUniqueEmail?email=${email}`);
            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

}

export default CustomerService;