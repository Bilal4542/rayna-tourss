import { useCallback, useEffect, useState } from "react";
import { apiService } from "../api";

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    categoryCount: 0,
    cityCount: 0,
    cityPointCount: 0,
    productCount: 0,
  });
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityPoints, setCityPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryItems, cityItems, cityPointItems, dashboardStats] =
        await Promise.all([
          apiService.listResource("/categories"),
          apiService.listResource("/cities"),
          apiService.listResource("/city-points"),
          apiService.getDashboardMeta(),
        ]);

      setCategories(categoryItems);
      setCities(cityItems);
      setCityPoints(cityPointItems);
      setStats(dashboardStats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    stats,
    categories,
    cities,
    cityPoints,
    loading,
    error,
    reload,
  };
};
