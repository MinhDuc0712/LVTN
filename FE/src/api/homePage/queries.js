// queries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategoriesAPI } from "./request";
import { getUtilitiesAPI } from "./request";
import { axiosAdmin } from "../axios";
import { axiosUser } from "../axios";

import toast from "react-hot-toast";
import {
  getDepositTransactionsAPI,
  postDepositTransactionAPI,
  updateDepositTransactionAPI,
  deleteDepositTransactionAPI,
  getUserByIdentifierAPI,
} from "./request";

export const useGetCategoriesUS = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
export const useGetUtilitiesUS = (page = 1) => {
  return useQuery({
    queryKey: ["utilities", page],
    queryFn: () => getUtilitiesAPI(page),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
const DEPOSIT_QUERY_KEY = "deposits";

export const useGetDepositTransactions = (params) => {
  return useQuery({
    queryKey: [DEPOSIT_QUERY_KEY, params],
    queryFn: () => getDepositTransactionsAPI(params),
    keepPreviousData: true,
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
    },
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
    },
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
    },
  });
};

export const useGetUserByIdentifier = (identifier) => {
  return useQuery({
    queryKey: ["user", identifier],
    queryFn: () => getUserByIdentifierAPI(identifier),
    enabled: !!identifier,
    retry: false,
  });
};

//Lấy danh sách người dùng
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get("/user");
        return response;
      } catch (error) {
        if (error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
  });
};

// post house
export const useCreateHouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
  try {
    console.log("Payload sent:", data);

    const resData = await axiosUser.post("/houses", data);
    console.log("Response (after interceptor):", resData);

    const house = resData?.house;
    const houseId = house?.MaNha || resData?.MaNha;

    if (!houseId) {
      throw new Error("Không tìm thấy ID của bài đăng từ server.");
    }

    return {
      ...resData,
      houseId,
    };
  } catch (err) {
    console.error("Lỗi mutationFn:", err);
    throw err;
  }
},

    onSuccess: (data) => {
      queryClient.invalidateQueries(["houses"]);
      toast.success("Bài đăng đã được tạo thành công!");
      return data;
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Không thể kết nối đến máy chủ.");
        console.error("Network/Server error:", error);
        return;
      }

      const serverMessage = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        Object.values(validationErrors).forEach((errors) => {
          errors.forEach((message) => toast.error(message));
        });
      } else {
        toast.error(
          serverMessage ||
            error.message ||
            "Lỗi không xác định khi tạo bài đăng",
        );
      }

      console.error("Error response:", error.response?.data || error.message);
    },
  });
};

// upload images
export const useUploadHouseImages = () => {
  return useMutation({
    mutationFn: async ({ houseId, images }) => {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images[]", image); 
      });

      const response = await axiosUser.post(
        `/houses/${houseId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        },
      );

      return response.data;
    },
    onError: (error) => {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || "Lỗi khi upload ảnh");
      throw error;
    },
  });
};
export const useAuthUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await axiosUser.get("/me");
        if (!res || !res.user) {
          console.error("Response không hợp lệ:", res);
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
        return res.user;
      } catch (error) {
        console.error("Lỗi khi gọi API:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        throw error;
      }
    },
    retry: false,
    staleTime: 0, // Không lưu dữ liệu cũ
  });
};





export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: async ({ userId, role, status }) => {
      console.log("Sending data:", { Role: role, TrangThai: status });
      const response = await axiosAdmin.put(`/user/${userId}`, {
        Role: role,
        TrangThai: status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      console.error(
        "Lỗi khi cập nhật quyền:",
        error.response?.data || error.message,
      );
    },
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, reason }) =>
      await axiosAdmin.post(`/user/${userId}/ban`, { LyDo: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) =>
      await axiosAdmin.post(`/user/${userId}/unban`),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await axiosAdmin.get("/roles");
      return response; // Trả về mảng roles
    },
    onError: (error) => {
      console.error("Lỗi khi lấy danh sách quyền:", error);
    },
  });
};
//edit post
export const useUpdateHouse = () => {
  return useMutation({ mutationFn: updatePost });
};