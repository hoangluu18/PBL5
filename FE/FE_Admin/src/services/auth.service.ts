import axios from "../axios.customize";

class AuthService {
    async login(email: string, password: string, rememberMe: boolean = false): Promise<any> {
        try {
            const response = await axios.post(`/auth/login`, { email, password, rememberMe });

            return response.data;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    }

    async forgotPassword(email: string): Promise<any> {
        try {
            const response = await axios.post(`/auth/forgot-password?email=${email}`);
            return response.data;
        } catch (error) {
            console.error("Error during forgot password:", error);
            throw error;
        }
    }

    async checkToken(token: string): Promise<any> {
        try {
            const response = await axios.get(`/auth/reset-password?token=${token}`);
            return response.data;
        }
        catch (error) {
            console.error("Error during token check:", error);
            throw error;
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<any> {
        try {
            const response = await axios.post(`/auth/reset-password?token=${token}&newPassword=${newPassword}`);
            return response.data;
        } catch (error) {
            console.error("Error during password reset:", error);
            throw error;
        }
    }
}

export default AuthService;