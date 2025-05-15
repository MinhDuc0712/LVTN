
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URI;
const timeout = +import.meta.env.VITE_API_TIME_OUT || 20000;

const axiosInstance = axios.create({
  baseURL,
  timeout,
});

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
