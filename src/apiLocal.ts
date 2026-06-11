import axios from "axios";

const apiLocal = axios.create({
  baseURL: "http://10.0.0.9:5980/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiLocal;