import Cookies from "js-cookie";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

const jwt_cookie = () => {
  return Cookies.get("__session");
};

export function reqConfig() {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt_cookie()}`,
    },
  };
}

export function getEndpoint(endpoint: string): string {
  const composedUrl = new URL(endpoint, BASE_API_URL);
  return composedUrl.href;
}
