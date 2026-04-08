import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

const getErrorMessage = (error) =>
  error?.response?.data?.message || "Failed to fetch homepage data.";

export const homeApi = {
  async getCategories() {
    try {
      const { data } = await api.get("/categories");
      return data?.data || [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getProductsGroupedByCity(categoryId) {
    try {
      const { data } = await api.get(`/products/grouped/category/${categoryId}`);
      return data?.data || { category: null, groupedByCity: [] };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
