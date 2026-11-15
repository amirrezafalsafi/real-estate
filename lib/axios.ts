import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api`
    : "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "خطایی در ارتباط با سرور رخ داد. لطفاً مجدداً تلاش کنید.";

    return Promise.reject({
      status: error.response?.status,
      message: customMessage,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default apiClient;
