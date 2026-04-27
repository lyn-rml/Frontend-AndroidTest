import axios from "axios";
import { API_URL } from "./../constants/network";

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export { api };
export default api;
