import axios from "../axios.customize";

export const getAddressesByCustomer = (customerId: number) =>
    axios.get(`/addresses/customer/${customerId}`);

export const addAddress = (data: any) =>
    axios.post('/addresses', data);

export const updateAddress = (id: number, data: any) =>
    axios.put(`/addresses/${id}`, data);

export const disableAddress = (id: number) =>
    axios.patch(`/addresses/${id}/disable`, {});

export const setDefaultAddress = (id: number, customerId: number) =>
    axios.patch(`/addresses/${id}/set-default?customerId=${customerId}`, {});
