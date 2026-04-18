import axios from "axios";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const baseURL = (rawBaseUrl.endsWith("/api") || rawBaseUrl.includes("localhost")) 
  ? rawBaseUrl 
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export default API;
