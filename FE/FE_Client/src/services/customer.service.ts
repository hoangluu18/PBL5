import axios from "../axios.customize";


class CustomerService {
    async checkUniqueEmail(email: string): Promise<any> {
        try {
            const response = await axios.post(`/customers/checkUniqueEmail?email=${email}`);
            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

}

export default CustomerService;