import axios from "axios";

const API = axios.create({
  baseURL: "https://vulnscan-lite-rig7.onrender.com",
});

export default API;
