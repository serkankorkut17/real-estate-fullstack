import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// Her istekte token’ı storage’dan al ve header’a ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;