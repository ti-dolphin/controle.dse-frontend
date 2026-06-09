import axios from "axios";

const apiLocal = axios.create({
  baseURL: "http://192.168.68.126:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiLocal;