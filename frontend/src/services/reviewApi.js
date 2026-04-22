import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/?$/, '/');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const reviewApi = {
  async getProductReviews(productId) {
    try {
      const { data } = await api.get(`reviews/product/${productId}`);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch reviews");
    }
  },

  async submitReview(productId, reviewData) {
    try {
      const { data } = await api.post(`reviews/product/${productId}`, reviewData);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to submit review");
    }
  }
};
