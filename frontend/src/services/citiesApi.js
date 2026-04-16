import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

const getErrorMessage = (error) =>
  error?.response?.data?.message || "Failed to fetch cities.";

export const citiesApi = {
  async getBestCities(category) {
    try {
      const { data } = await api.get("/cities", { params: { category } });
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

