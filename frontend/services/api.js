import axios from "axios";

// 1. Get the base URL from environment or default
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// 2. Ensure it has the /api suffix (Required for Render)
const baseURL = (rawBaseUrl.endsWith("/api") || rawBaseUrl.includes("localhost")) 
  ? rawBaseUrl 
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

// 3. Create the Axios instance with a single baseURL
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
