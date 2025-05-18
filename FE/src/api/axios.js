import axios from "axios";

const timeout = +import.meta.env.VITE_APP_API_TIME_OUT || 20000;

export const axiosUser = axios.create({
  baseURL: import.meta.env.VITE_API_URI_USER,
  timeout,
});

export const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URI_ADMIN,
  timeout,
});

[axiosUser, axiosAdmin].forEach(instance => {
  instance.interceptors.request.use(
    config => {
      config.headers["Content-Type"] = "application/json";
      return config;
    },
    error => Promise.reject(error)
  );

  instance.interceptors.response.use(
    response => response.data || response,
    error => Promise.reject(error)
  );
});
