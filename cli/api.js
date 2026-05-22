import axios from "axios";

const API = "http://localhost:8000/api/v1";

let token = "";

export const setToken = (t) => {
  token = t;
};

export const getToken = () => token;

export const api = axios.create({
  baseURL: API
});



api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});