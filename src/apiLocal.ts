import axios from "axios";

const apiLocal = axios.create({
  baseURL: "http://192.168.68.124:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiLocal;
