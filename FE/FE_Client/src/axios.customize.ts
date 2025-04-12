import axios from "axios";
import { isTokenExpired } from "./utils/tokenUtil";


const instance = axios.create();

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("access_token");
    if (token) {
        if (isTokenExpired(token)) {
            console.error("Token expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("customer");
            window.location.href = "/login";
            return Promise.reject(new Error("Token expired"));
        }
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "application/json";
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default instance;