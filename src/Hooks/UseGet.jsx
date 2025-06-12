
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

export const useGet = ({ url, enabled = true, pollInterval }) => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux store
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token || ""}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        setData(response.data);
      }
    } catch (error) {
      console.error("errorGet", error);
    } finally {
      setLoading(false);
    }
  }, [url, user?.token]);

  useEffect(() => {
    if (enabled) {
      fetchData(); // Initial fetch
      let intervalId;
      if (pollInterval) {
        intervalId = setInterval(fetchData, pollInterval);
      }
      return () => {
        if (intervalId) clearInterval(intervalId); // Cleanup on unmount or url/pollInterval change
      };
    }
  }, [fetchData, enabled, pollInterval]);

  return { refetch: fetchData, loading, data };
};