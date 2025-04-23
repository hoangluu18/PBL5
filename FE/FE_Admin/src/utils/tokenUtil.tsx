import { jwtDecode } from "jwt-decode";


export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: { exp: number } = jwtDecode(token);
        console.log("Decoded token:", decoded);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return true;
    }
};