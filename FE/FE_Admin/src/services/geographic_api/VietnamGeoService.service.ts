import axios from 'axios';

export class VietnamGeoService {
    private API_URL = "https://pmshoanghot-apitinhthanhdocker.hf.space"; 

    async getAllCities(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.API_URL}/api/list`);
            console.log("Cities API response:", response.data);
            return response.data.map((city: any) => city.name);
        } catch (error) {
            console.error("Error fetching cities:", error);
            return [];
        }
    }

    async getDistrictsByCity(city: string): Promise<string[]> {
        try {
            // Giữ nguyên tên đầy đủ của tỉnh/thành phố khi gọi API
            const url = `${this.API_URL}/api/city/${encodeURIComponent(city)}/districts`;
            console.log("Districts API URL:", url);
            
            const response = await axios.get(url);
            console.log("Districts API response:", response.data);
            return response.data.map((district: any) => district.name);
        } catch (error) {
            console.error(`Error fetching districts for city ${city}:`, error);
            return [];
        }
    }

    async getWardsByDistrictAndCity(city: string, district: string): Promise<string[]> {
        try {
            // Giữ nguyên tên đầy đủ của tỉnh/thành phố và quận/huyện
            const url = `${this.API_URL}/api/city/${encodeURIComponent(city)}/district/${encodeURIComponent(district)}/wards`;
            console.log("Wards API URL:", url);
            
            const response = await axios.get(url);
            console.log("Wards API response:", response.data);
            return response.data.map((ward: any) => ward.name);
        } catch (error) {
            console.error(`Error fetching wards for district ${district} in city ${city}:`, error);
            return [];
        }
    }
}