import axios from "axios";

const API = axios.create({
  baseURL: "https://vulnscan-lite.onrender.com",
});

export default API;
