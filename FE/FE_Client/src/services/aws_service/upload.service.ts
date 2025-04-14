import axios from 'axios';

const API_URL = 'http://localhost:8081/api/customers';

class UploadService {
    async uploadAvatar(customerId: number, file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${API_URL}/${customerId}/avatar`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );

            return response.data.avatarUrl;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    }
}

export default new UploadService();