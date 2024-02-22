import {useGetData} from "@/lib/http";

export const useGetSimpleReq = async (url: string) => {
  const {data, loading, error} = useGetData(url);
  return {data, loading, error};
}