import Cookies from "js-cookie";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

const jwt_cookie = () => {
  return Cookies.get('__session')
}

export function reqConfig(method: 'GET' | 'POST', url: string) {
  return {
    url: BASE_API_URL + url,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
    cookies: {
      'JWT': jwt_cookie()
    }
  }
}