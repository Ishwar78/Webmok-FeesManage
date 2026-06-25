import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and force re-login
      localStorage.clear();
      window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export default API;
