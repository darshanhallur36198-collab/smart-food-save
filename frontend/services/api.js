import axios from "axios";

// 1. Get and clean the base URL from environment (prevents duplication like /api/api)
const rawBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const baseURL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

// 2. Create the Axios instance with the verified single baseURL
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
