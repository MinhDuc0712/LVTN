// queries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategoriesAPI } from "./request";
import { axiosAdmin } from '../axios';
import toast from 'react-hot-toast';
import { 
  getDepositTransactionsAPI,
  postDepositTransactionAPI,
  updateDepositTransactionAPI,
  deleteDepositTransactionAPI,
  getUserByIdentifierAPI

} from './request';

export const useGetCategoriesUS = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
const DEPOSIT_QUERY_KEY = 'deposits';

export const useGetDepositTransactions = (params) => {
  return useQuery({
    queryKey: [DEPOSIT_QUERY_KEY, params],
    queryFn: () => getDepositTransactionsAPI(params),
    keepPreviousData: true
  });
};

export const usePostDepositTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDepositTransactionAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(DEPOSIT_QUERY_KEY);
      toast.success("Thêm giao dịch thành công!");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  });
};

export const useUpdateDepositTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => updateDepositTransactionAPI(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(DEPOSIT_QUERY_KEY);
      toast.success("Cập nhật giao dịch thành công!");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  });
};

export const useDeleteDepositTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepositTransactionAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(DEPOSIT_QUERY_KEY);
      toast.success("Xóa giao dịch thành công!");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  });
};

export const useGetUserByIdentifier = (identifier) => {
  return useQuery({
    queryKey: ['user', identifier],
    queryFn: () => getUserByIdentifierAPI(identifier),
    enabled: !!identifier,
    retry: false, // Không retry khi lỗi 404
  });
};