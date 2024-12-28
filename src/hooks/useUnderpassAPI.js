import { useState, useEffect, useCallback } from 'react';

const API_URL = "http://localhost:8000";

const useUnderpassAPI = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from the API
  const fetchData = useCallback(async (newParams = {}) => {
    setIsLoading(true);
      setError(null);
      try {
        if (newParams.area || newParams.osmId) {
          const response = await fetch(`${API_URL}/${endpoint}?${new URLSearchParams(newParams)}`);
          if (!response.ok) throw new Error('Failed to fetch data');
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
  }, [endpoint, params]);

  useEffect(() => {
    fetchData(params);
  }, [params, fetchData]);

  return { data, isLoading, error, fetchData };
};

export default useUnderpassAPI;