import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  timeout: 1000 * 60 * 20
});

export async function runScraper(payload) {
  const { data } = await api.post("/api/run-scraper", payload);
  return data;
}

export function getDownloadUrl(path) {
  return `${api.defaults.baseURL}${path}`;
}
