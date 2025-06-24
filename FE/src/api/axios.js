  import axios from "axios";

  const timeout = +import.meta.env.VITE_APP_API_TIME_OUT || 20000;

  export const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_API_URI_AUTH,
    timeout,
  });

export const axiosUser = axios.create({
  baseURL: import.meta.env.VITE_API_URI_USER,
  timeout,
});

export const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URI_ADMIN,
  timeout,
});

[axiosUser, axiosAdmin, axiosAuth].forEach(instance => {
  instance.interceptors.request.use(
    config => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
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
