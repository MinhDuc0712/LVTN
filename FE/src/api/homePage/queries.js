// queries.js
import { useQuery } from "@tanstack/react-query";
import { getCategoriesAPI } from "./request";

export const useGetCategoriesUS = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
