import {useEffect, useState} from "react";

import axios from "axios";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useGetData(url: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    const reqConfig = {
      url: BASE_API_URL + url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const request = await axios(reqConfig);
        setData(request.data);
      } catch (error) {
        // @ts-ignore
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return {data, loading, error}
}