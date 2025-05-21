import { axiosUser, axiosAdmin } from "../axios";

// Lấy danh mục cho user
export const getCategoriesAPI = async () => {
  const response = await axiosUser.get("/categories");
  return response;
};

// Thêm danh mục từ admin
export const postCategoryAPI = async (data) => {
  const response = await axiosAdmin.post("/categories", data);
  return response;
};
// Cập nhật danh mục
export const updateCategoryAPI = async (id, data) => {
  return await axiosAdmin.put(`/categories/${id}`, data);
};

export const deleteCategoryAPI = async (id) => {
  return await axiosAdmin.delete(`/categories/${id}`);
};
// Thêm giao dịch nạp tiền
export const getDepositTransactionsAPI = async (params = {}) => {
  const response = await axiosAdmin.get("/deposits", { 
    params: {
      page: params.page,
      search: params.search,
      status: params.status
    }
  });
  return response.data;
}

export const postDepositTransactionAPI = async (data) => {
  const response = await axiosAdmin.post("/deposits", data);
  return response.data;
};

export const updateDepositTransactionAPI = async (id, data) => {
  const response = await axiosAdmin.put(`/deposits/${id}`, data);
  return response.data;
};

export const deleteDepositTransactionAPI = async (id) => {
  const response = await axiosAdmin.delete(`/deposits/${id}`);
  return response.data;
};
export const getUserByIdentifierAPI = async (identifier) => {
  try {
    const response = await axiosAdmin.get(`/users/${identifier}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
export const findUserAPI = async (identifier) => {
  try {
    const response = await axiosAdmin.get(`/users/${identifier}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        success: false,
        message: 'Không tìm thấy người dùng'
      };
    }
    throw error;
  }
};
export const updateUserBalanceAPI = async (userId, amount) => {
  return await axiosAdmin.patch(`/user/${userId}`, { amount });
}