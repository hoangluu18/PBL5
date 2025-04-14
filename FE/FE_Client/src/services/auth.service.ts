import axios from "axios";

const API_URL = "http://localhost:8081/api/auth";

interface RegisterPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
}


class AuthService {
    async login(email: string, password: string, rememberMe: boolean = false): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password, rememberMe });
            if (response.data.accessToken) {
                localStorage.setItem("access_token", (response.data.accessToken));
            }
            return response.data;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    }

    async register(payload: RegisterPayload): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}/register`, payload);
            return response.data;
        } catch (error) {
            console.error("Error during registration:", error);
            throw error;
        }
    }

    async forgotPassword(email: string): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}/forgot-password?email=${email}`);
            return response.data;
        } catch (error) {
            console.error("Error during forgot password:", error);
            throw error;
        }
    }

    async checkToken(token: string): Promise<any> {
        try {
            const response = await axios.get(`${API_URL}/reset-password?token=${token}`);
            return response.data;
        }
        catch (error) {
            console.error("Error during token check:", error);
            throw error;
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}/reset-password?token=${token}&newPassword=${newPassword}`);
            return response.data;
        } catch (error) {
            console.error("Error during password reset:", error);
            throw error;
        }
    }
}

export default AuthService;