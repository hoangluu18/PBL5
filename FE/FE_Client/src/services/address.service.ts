import axios from "axios";

const BASE_URL = "http://localhost:8081/api/addresses";

// Hàm lấy header chứa token
const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getAddressesByCustomer = (customerId: number) =>
    axios.get(`${BASE_URL}/customer/${customerId}`, getAuthHeader());

export const addAddress = (data: any) =>
    axios.post(BASE_URL, data, getAuthHeader());

export const updateAddress = (id: number, data: any) =>
    axios.put(`${BASE_URL}/${id}`, data, getAuthHeader());

export const disableAddress = (id: number) =>
    axios.patch(`${BASE_URL}/${id}/disable`, {}, getAuthHeader());

export const setDefaultAddress = (id: number, customerId: number) =>
    axios.patch(`${BASE_URL}/${id}/set-default?customerId=${customerId}`, {}, getAuthHeader());
